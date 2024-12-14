import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { BudgetMonthCategory } from './budget-month-category.entity';
import { Budget } from './budget.entity';

@Entity()
@Index('budget_month_budget_id_year_month_idx', ['budget', 'year', 'month'], { unique: true })
export class BudgetMonth {
    @PrimaryGeneratedColumn('uuid', {
        name: 'budget_month_id',
        primaryKeyConstraintName: 'budget_month_pkey',
    })
    budgetMonthId!: number;

    @ManyToOne(() => Budget, (budget) => budget.months, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'budget_id',
        referencedColumnName: 'budgetId',
        foreignKeyConstraintName: 'budget_month_budget_id_fkey',
    })
    budget!: Budget;

    @Column('integer', {
        nullable: true,
    })
    year: number | undefined;

    @Column('integer', {
        nullable: true,
    })
    month: number | undefined;

    @OneToMany(() => BudgetMonthCategory, (budgetMonthCategory) => budgetMonthCategory.budgetMonth)
    categories: BudgetMonthCategory[] | undefined;
}
