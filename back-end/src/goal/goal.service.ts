import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, IsNull, Not, Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { DatabaseService } from '../database/database.service';
import { ScheduleService } from '../schedule/schedule.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GoalInfoDto } from './dto/goal-info.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';

@Injectable()
export class GoalService {
    private readonly _logger = new Logger(GoalService.name);

    constructor(
        @InjectRepository(Goal)
        private readonly _goalRepository: Repository<Goal>,
        private readonly _databaseService: DatabaseService,
        private readonly _categoryService: CategoryService,
        private readonly _scheduleService: ScheduleService
    ) {}

    /**
     * Get all the goals `GoalInfoDto`
     *
     * @param archived
     */
    async getAllGoalInfos(archived: boolean): Promise<GoalInfoDto[]> {
        try {
            const findOptions: FindManyOptions<Goal> = {
                relations: ['category', 'schedule'],
                withDeleted: archived,
            };

            if (archived)
                findOptions.where = {
                    deletedDate: Not(IsNull()),
                };

            const goals = await this._goalRepository.find(findOptions);
            if (goals.length > 0) {
                return goals.map((g) => this._mapGoalInfoDto(g));
            }

            this._logger.log('No goals found');
            return [];
        } catch (e) {
            this._logger.error('Exception when getting all goals:', e);
            return [];
        }
    }

    /**
     * Get a single goal `GoalInfoDto`
     *
     * @param id
     * @param archived
     */
    async getGoalInfo(id: string, archived: boolean): Promise<GoalInfoDto | null> {
        try {
            const goal = await this.getGoal(id, archived);
            if (goal) {
                return this._mapGoalInfoDto(goal);
            }

            this._logger.log(`Could not find goal '${id}'`);
            return null;
        } catch (e) {
            this._logger.error('Exception when getting goal:', e);
            return null;
        }
    }

    /**
     * Get a single goal `Goal`
     *
     * @param id
     * @param archived
     */
    async getGoal(id: string, archived = false): Promise<Goal | null> {
        try {
            return await this._goalRepository.findOne({
                where: {
                    goalId: id,
                },
                relations: ['category', 'schedule'],
                withDeleted: archived,
            });
        } catch (e) {
            this._logger.error('Exception when getting goal:', e);
            return null;
        }
    }

    /**
     * Create a new goal
     *
     * @param dto
     */
    async createGoal(dto: CreateGoalDto): Promise<string | null> {
        try {
            const goal = new Goal();
            await this._setGoalProperties(dto, goal);

            const db = await this._databaseService.save(goal);
            if (db) return db.goalId;

            this._logger.error(`Could not create goal: '${dto.name}'`);
            return null;
        } catch (e) {
            this._logger.error('Exception when creating goal:', e);
            return null;
        }
    }

    /**
     * Update an existing goal
     *
     * @param dto
     */
    async updateGoal(dto: UpdateGoalDto): Promise<boolean> {
        try {
            const goal = await this.getGoal(dto.goalId);
            if (goal) {
                await this._setGoalProperties(dto, goal);
                await this._databaseService.save(goal);
                return true;
            }

            this._logger.warn(`Could not find goal to update: '${dto.goalId}'`);
            return false;
        } catch (e) {
            this._logger.error('Exception when updating goal:', e);
            return false;
        }
    }

    /**
     * Archive (soft-delete) an existing goal
     *
     * @param id
     */
    async archiveGoal(id: string): Promise<boolean> {
        try {
            const goal = await this._goalRepository.findOneBy({ goalId: id });
            if (goal) {
                await this._databaseService.softRemove(goal);
                return true;
            }

            this._logger.log(`Could not find goal to archive: '${id}'`);
            return true;
        } catch (e) {
            this._logger.error('Exception when archiving goal:', e);
            return false;
        }
    }

    /**
     * Permanently delete an existing goal
     *
     * @param id
     */
    async permanentlyDeleteGoal(id: string): Promise<boolean> {
        try {
            const goal = await this.getGoal(id, true);
            if (goal) {
                await this._databaseService.remove(goal);
                return true;
            }

            this._logger.log(`Could not find goal to delete: '${id}'`);
            return true;
        } catch (e) {
            this._logger.error('Exception when deleting goal:', e);
            return false;
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Map a `Goal` to a `GoalInfoDto`
     *
     * @param goal
     */
    private _mapGoalInfoDto(goal: Goal): GoalInfoDto {
        return {
            goalId: goal.goalId,
            name: goal.name,
            description: goal.description,
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            category: goal.category
                ? this._categoryService.mapCategoryInfo(goal.category)
                : undefined,
            totalAmount: goal.totalAmount,
            startDate: goal.startDate,
            endDate: goal.endDate,
            schedule: goal.schedule
                ? this._scheduleService.mapScheduleInfoDto(goal.schedule)
                : undefined,
        };
    }

    /**
     * Set the properties of a `Goal` from a `CreateGoalDto`
     *
     * @param dto
     * @param goal
     */
    private async _setGoalProperties(dto: CreateGoalDto, goal: Goal): Promise<void> {
        goal.name = dto.name;
        goal.description = dto.description;
        goal.totalAmount = dto.amount;
        goal.endDate = dto.endDate;

        if (goal.startDate && goal.endDate && goal.startDate < goal.endDate)
            goal.startDate = dto.startDate;
        else goal.startDate = undefined;

        const category = await this._categoryService.getCategoryById(dto.categoryId);
        if (category) goal.category = category;
        else
            this._logger.error(
                `Could not find category: '${dto.categoryId}' when creating goal: '${dto.name}'`
            );

        if (dto.scheduleId) {
            const schedule = await this._scheduleService.getSchedule(dto.scheduleId);
            if (schedule) goal.schedule = schedule;
        }
    }
}
