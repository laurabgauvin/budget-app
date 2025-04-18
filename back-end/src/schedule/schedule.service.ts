import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseService } from '../database/database.service';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class ScheduleService {
    private readonly _logger = new Logger(ScheduleService.name);

    constructor(
        @InjectRepository(Schedule)
        private readonly _scheduleRepository: Repository<Schedule>,
        private readonly _databaseService: DatabaseService
    ) {}

    /**
     * Get a single schedule `Schedule`
     *
     * @param id
     */
    async getScheduleById(id: string): Promise<Schedule | null> {
        try {
            return await this._scheduleRepository.findOneBy({ scheduleId: id });
        } catch (e) {
            this._logger.error('Exception when getting schedule:', e);
            return null;
        }
    }
}
