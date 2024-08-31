import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BudgetMonth } from '../../budget/entities/budget-month.entity';
import { Category } from './category.entity';

@Entity()
export class BudgetMonthCategory {
    @PrimaryGeneratedColumn({
        primaryKeyConstraintName: 'budget_month_category_pkey',
    })
    budget_month_category_id!: string;

    @Column('uuid', {
        name: 'budget_month_id',
    })
    @ManyToOne(() => BudgetMonth, (budgetMonth) => budgetMonth.categories, {
        cascade: true,
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn({
        name: 'budget_month_id',
        foreignKeyConstraintName: 'budget_month_category_budget_month_id_fkey',
    })
    budgetMonth!: BudgetMonth;

    @Column('uuid', {
        name: 'category_id',
    })
    @ManyToOne(() => Category, (category) => category.budgetMonths, {
        cascade: true,
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn({
        name: 'category_id',
        foreignKeyConstraintName: 'budget_month_category_category_id_fkey',
    })
    category!: Category;

    @Column({
        type: 'numeric',
        precision: 15,
        scale: 2,
        nullable: true,
    })
    amount_budgeted: number | undefined;
}
