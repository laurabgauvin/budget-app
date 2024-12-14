import { DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { BudgetMonthCategory } from '../../category/entities/budget-month-category.entity';
import { Category } from '../../category/entities/category.entity';
import { TransactionCategory } from '../../category/entities/transaction-category.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { BudgetMonth } from './budget-month.entity';
import { Budget } from './budget.entity';

@ViewEntity({
    expression: (dataSource: DataSource) =>
        dataSource
            .createQueryBuilder()
            .select('b.budget_id')
            .addSelect('bm.budget_month_id')
            .addSelect('bm.year', 'year')
            .addSelect('bm.month', 'month')
            .addSelect('bmc.category_id')
            .addSelect('c.name', 'category_name')
            .addSelect('bmc.budget_month_category_id')
            .addSelect('bmc.amount_budgeted')
            .addSelect('coalesce(sum(tc.amount), 0)', 'amount_spent')
            .addSelect('bmc.amount_budgeted - coalesce(sum(tc.amount), 0)', 'amount_available')
            .from(BudgetMonthCategory, 'bmc')
            .innerJoin(BudgetMonth, 'bm', 'bm.budget_month_id = bmc.budget_month_id')
            .innerJoin(Budget, 'b', 'b.budget_id = bm.budget_id')
            .innerJoin(Category, 'c', 'c.category_id = bmc.category_id')
            .leftJoin(TransactionCategory, 'tc', 'bmc.category_id = tc.category_id')
            .leftJoin(
                Transaction,
                't',
                'tc.transaction_id = t.transaction_id and extract(year from t.date) = bm.year and extract(month from t.date) = bm.month'
            )
            .groupBy('b.budget_id')
            .addGroupBy('bm.budget_month_id')
            .addGroupBy('bm.year')
            .addGroupBy('bm.month')
            .addGroupBy('bmc.category_id')
            .addGroupBy('c.name')
            .addGroupBy('bmc.budget_month_category_id')
            .addGroupBy('bmc.amount_budgeted')
            .orderBy('b.budget_id')
            .addOrderBy('bm.year')
            .addOrderBy('bm.month')
            .addOrderBy('bmc.category_id'),
})
export class BudgetView {
    @ViewColumn({
        name: 'budget_id',
    })
    budgetId!: string;

    @ViewColumn({
        name: 'budget_month_id',
    })
    budgetMonthId!: string;

    @ViewColumn()
    year: number | undefined;

    @ViewColumn()
    month: number | undefined;

    @ViewColumn({
        name: 'category_id',
    })
    categoryId!: string;

    @ViewColumn({
        name: 'category_name',
    })
    categoryName: string | undefined;

    @ViewColumn({
        name: 'budget_month_category_id',
    })
    budgetMonthCategoryId!: number;

    @ViewColumn({
        name: 'amount_budgeted',
    })
    amountBudgeted: number | undefined;

    @ViewColumn({
        name: 'amount_spent',
    })
    amountSpent: number | undefined;

    @ViewColumn({
        name: 'amount_available',
    })
    amountAvailable: number | undefined;
}
