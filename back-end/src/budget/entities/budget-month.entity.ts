import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { BudgetMonthCategory } from '../../category/entities/budget-month-category.entity';
import { Budget } from './budget.entity';

@Entity()
@Index('budget_month_budget_id_year_month_idx', ['budget', 'year', 'month'], { unique: true })
export class BudgetMonth {
    @PrimaryGeneratedColumn('uuid', {
        primaryKeyConstraintName: 'budget_month_pkey',
    })
    budget_month_id!: number;

    @Column('uuid', {
        name: 'budget_id',
        nullable: false,
    })
    @ManyToOne(() => Budget, (budget) => budget.months, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'budget_id', foreignKeyConstraintName: 'budget_month_budget_id_fkey' })
    budget!: Budget;

    @Column('integer', {
        nullable: true,
    })
    year: number | undefined;

    @Column('integer', {
        nullable: true,
    })
    month: number | undefined;

    @OneToMany(() => BudgetMonthCategory, (category) => category.budgetMonth)
    categories: BudgetMonthCategory[] | undefined;
}
