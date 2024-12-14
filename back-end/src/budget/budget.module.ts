import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { BudgetMonthCategory } from './entities/budget-month-category.entity';
import { BudgetMonth } from './entities/budget-month.entity';
import { Budget } from './entities/budget.entity';
import { BudgetView } from './entities/budget.view';

@Module({
    imports: [TypeOrmModule.forFeature([Budget, BudgetMonth, BudgetMonthCategory, BudgetView])],
    controllers: [BudgetController],
    providers: [BudgetService],
})
export class BudgetModule {}
