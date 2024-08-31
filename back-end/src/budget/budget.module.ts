import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { BudgetMonth } from './entities/budget-month.entity';
import { Budget } from './entities/budget.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Budget, BudgetMonth])],
    controllers: [BudgetController],
    providers: [BudgetService],
})
export class BudgetModule {}
