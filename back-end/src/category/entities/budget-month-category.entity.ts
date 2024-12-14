import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BudgetMonth } from '../../budget/entities/budget-month.entity';
import { Category } from './category.entity';

@Entity()
export class BudgetMonthCategory {
    @PrimaryGeneratedColumn({
        type: 'integer',
        name: 'budget_month_category_id',
        primaryKeyConstraintName: 'budget_month_category_pkey',
    })
    budgetMonthCategoryId!: number;

    @Column('uuid', {
        name: 'budget_month_id',
        nullable: false,
    })
    @ManyToOne(() => BudgetMonth, (budgetMonth) => budgetMonth.categories, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'budget_month_id',
        referencedColumnName: 'budgetMonthId',
        foreignKeyConstraintName: 'budget_month_category_budget_month_id_fkey',
    })
    budgetMonth!: BudgetMonth;

    @Column('uuid', {
        name: 'category_id',
        nullable: false,
    })
    @ManyToOne(() => Category, (category) => category.budgetMonths, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'category_id',
        referencedColumnName: 'categoryId',
        foreignKeyConstraintName: 'budget_month_category_category_id_fkey',
    })
    category!: Category;

    @Column({
        type: 'numeric',
        name: 'amount_budgeted',
        precision: 15,
        scale: 2,
        nullable: true,
    })
    amountBudgeted: number | undefined;
}
