import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { Schedule } from './entities/schedule.entity';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';

@Module({
    imports: [TypeOrmModule.forFeature([Schedule]), DatabaseModule],
    controllers: [ScheduleController],
    providers: [ScheduleService],
    exports: [ScheduleService],
})
export class ScheduleModule {}
