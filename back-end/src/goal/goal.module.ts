import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { DatabaseModule } from '../database/database.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { Goal } from './entities/goal.entity';
import { GoalController } from './goal.controller';
import { GoalService } from './goal.service';

@Module({
    imports: [TypeOrmModule.forFeature([Goal]), DatabaseModule, CategoryModule, ScheduleModule],
    controllers: [GoalController],
    providers: [GoalService],
    exports: [GoalService],
})
export class GoalModule {}
