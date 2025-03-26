import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { Goal } from './entities/goal.entity';
import { GoalController } from './goal.controller';
import { GoalService } from './goal.service';

@Module({
    imports: [TypeOrmModule.forFeature([Goal]), DatabaseModule],
    controllers: [GoalController],
    providers: [GoalService],
    exports: [GoalService],
})
export class GoalModule {}
