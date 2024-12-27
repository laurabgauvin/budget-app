import { DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { Account } from '../../account/entities/account.entity';
import { Category } from '../../category/entities/category.entity';
import { TransactionCategory } from '../../category/entities/transaction-category.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { BudgetMonthCategory } from './budget-month-category.entity';
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
            .addSelect('coalesce(sum(tc1.amount), 0)', 'amount_spent')
            .addSelect('bmc.amount_budgeted - coalesce(sum(tc1.amount), 0)', 'amount_available')
            .from(BudgetMonthCategory, 'bmc')
            .innerJoin(BudgetMonth, 'bm', 'bm.budget_month_id = bmc.budget_month_id')
            .innerJoin(Budget, 'b', 'b.budget_id = bm.budget_id')
            .innerJoin(Category, 'c', 'c.category_id = bmc.category_id')
            .leftJoin(
                () =>
                    dataSource
                        .createQueryBuilder()
                        .subQuery()
                        .select('tc2.category_id')
                        .addSelect('t.date', 'date')
                        .addSelect('sum(tc2.amount)', 'amount')
                        .from(TransactionCategory, 'tc2')
                        .innerJoin(Transaction, 't', 'tc2.transaction_id = t.transaction_id')
                        .innerJoin(Account, 'a', 't.account_id = a.account_id')
                        .where('a.tracked = true')
                        .groupBy('tc2.category_id')
                        .addGroupBy('t.date'),
                'tc1',
                'bmc.category_id = tc1.category_id ' +
                    'and extract(year from tc1.date) = bm.year ' +
                    'and extract(month from tc1.date) = bm.month'
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
    @ViewColumn()
    budgetId!: string;

    @ViewColumn()
    budgetMonthId!: string;

    @ViewColumn()
    year: number | undefined;

    @ViewColumn()
    month: number | undefined;

    @ViewColumn()
    categoryId!: string;

    @ViewColumn()
    categoryName: string | undefined;

    @ViewColumn()
    budgetMonthCategoryId!: number;

    @ViewColumn()
    amountBudgeted: number | undefined;

    @ViewColumn()
    amountSpent: number | undefined;

    @ViewColumn()
    amountAvailable: number | undefined;
}
