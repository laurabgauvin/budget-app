import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { DatabaseService } from '../database/database.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleInfoDto } from './dto/schedule-info.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule, ScheduleFrequency } from './entities/schedule.entity';

@Injectable()
export class ScheduleService {
    private readonly _logger = new Logger(ScheduleService.name);

    constructor(
        @InjectRepository(Schedule)
        private readonly _scheduleRepository: Repository<Schedule>,
        private readonly _databaseService: DatabaseService
    ) {}

    /**
     * Get all the schedules `ScheduleInfoDto`
     */
    async getAllScheduleInfos(): Promise<ScheduleInfoDto[]> {
        try {
            const schedules = await this._scheduleRepository.find({
                order: {
                    displayOrder: 'asc',
                },
            });
            if (schedules.length > 0) {
                return schedules.map((s) => this.mapScheduleInfoDto(s));
            }

            this._logger.log('No schedules found');
            return [];
        } catch (e) {
            this._logger.error('Exception when getting all schedules:', e);
            return [];
        }
    }

    /**
     * Get a single schedule `ScheduleInfoDto`
     *
     * @param id
     */
    async getScheduleInfo(id: string): Promise<ScheduleInfoDto | null> {
        try {
            const schedule = await this.getSchedule(id);
            if (schedule) {
                return this.mapScheduleInfoDto(schedule);
            }

            this._logger.log(`Could not find schedule: '${id}'`);
            return null;
        } catch (e) {
            this._logger.error('Exception when getting schedule:', e);
            return null;
        }
    }

    /**
     * Get a single schedule `Schedule`
     *
     * @param id
     */
    async getSchedule(id: string): Promise<Schedule | null> {
        try {
            return await this._scheduleRepository.findOneBy({ scheduleId: id });
        } catch (e) {
            this._logger.error('Exception when getting schedule:', e);
            return null;
        }
    }

    /**
     * Create a new schedule
     *
     * @param dto
     */
    async createSchedule(dto: CreateScheduleDto): Promise<string | null> {
        try {
            if (!(await this._checkDuplicateSchedule(dto.frequency, dto.interval))) {
                this._logger.error(`Duplicate schedule: '${dto.frequency}' '${dto.interval}'`);
                return null;
            }

            const schedule = new Schedule();
            this._setScheduleProperties(dto, schedule);

            await this._updateDisplayOrder(dto.displayOrder);
            const db = await this._databaseService.save(schedule);
            if (db) return db.scheduleId;

            this._logger.error(`Could not create schedule: '${dto.displayName}'`);
            return null;
        } catch (e) {
            this._logger.error('Exception when creating schedule:', e);
            return null;
        }
    }

    /**
     * Update an existing schedule
     *
     * @param dto
     */
    async updateSchedule(dto: UpdateScheduleDto): Promise<boolean> {
        try {
            const schedule = await this.getSchedule(dto.scheduleId);

            if (!schedule) {
                this._logger.warn(`Could not find schedule to update: '${dto.scheduleId}'`);
                return false;
            }

            if (!schedule.isEditable) {
                this._logger.error(`The schedule: '${schedule.displayName}' may not be edited`);
                return false;
            }

            if (
                !(await this._checkDuplicateSchedule(dto.frequency, dto.interval, dto.scheduleId))
            ) {
                this._logger.error(
                    `Duplicate schedule: '${dto.frequency}' '${dto.interval}' for schedule: '${schedule.displayName}'`
                );
                return false;
            }

            await this._updateDisplayOrder(dto.displayOrder, dto.scheduleId);
            this._setScheduleProperties(dto, schedule);
            await this._databaseService.save(schedule);
            return true;
        } catch (e) {
            this._logger.error('Exception when updating schedule:', e);
            return false;
        }
    }

    /**
     * Delete an existing schedule
     *
     * @param id
     */
    async deleteSchedule(id: string): Promise<boolean> {
        try {
            const schedule = await this.getSchedule(id);
            if (!schedule) {
                this._logger.log(`Could not find schedule to delete: '${id}'`);
                return true;
            }

            if (!schedule.isEditable) {
                this._logger.error(`The schedule: '${schedule.displayName}' may not be deleted`);
                return false;
            }

            await this._databaseService.remove(schedule);
            return true;
        } catch (e) {
            this._logger.error('Exception when deleting schedule:', e);
            return false;
        }
    }

    /**
     * Map a `Schedule` to a `ScheduleInfoDto`
     *
     * @param schedule
     */
    mapScheduleInfoDto(schedule: Schedule): ScheduleInfoDto {
        return {
            scheduleId: schedule.scheduleId,
            displayName: schedule.displayName,
            frequency: schedule.frequency,
            interval: schedule.interval,
            displayOrder: schedule.displayOrder,
            isEditable: schedule.isEditable,
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set the properties of a `Schedule` from a `CreateScheduleDto`
     *
     * @param dto
     * @param schedule
     */
    private _setScheduleProperties(dto: CreateScheduleDto, schedule: Schedule): void {
        schedule.frequency = dto.frequency;
        schedule.interval = dto.interval;
        schedule.displayName = dto.displayName;
        schedule.displayOrder = dto.displayOrder;
    }

    /**
     * Check if this schedule already exists
     *
     * @param frequency
     * @param interval
     * @param scheduleId
     */
    private async _checkDuplicateSchedule(
        frequency: ScheduleFrequency,
        interval: number,
        scheduleId?: string
    ): Promise<boolean> {
        const findOptions: FindOptionsWhere<Schedule> = {
            frequency: frequency,
            interval: interval,
        };
        if (scheduleId) findOptions.scheduleId = Not(scheduleId);
        return (await this._scheduleRepository.countBy(findOptions)) === 0;
    }

    /**
     * Update the display order of all schedules with a display order greater than or equal to the given display order
     *
     * @param displayOrder
     * @param scheduleId
     */
    private async _updateDisplayOrder(displayOrder: number, scheduleId?: string): Promise<void> {
        try {
            const findOptions: FindOptionsWhere<Schedule> = {
                displayOrder: MoreThanOrEqual(displayOrder),
            };

            if (scheduleId) {
                findOptions.scheduleId = Not(scheduleId);
            }

            await this._scheduleRepository
                .createQueryBuilder()
                .update(Schedule)
                .set({ displayOrder: () => 'display_order + 1' })
                .where(findOptions)
                .execute();
        } catch (e) {
            this._logger.error('Exception when updating display orders:', e);
        }
    }
}
