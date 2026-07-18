import {
    Column,
    CreateDateColumn,
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
@Index(['budget', 'year', 'month'], { unique: true })
export class BudgetMonth {
    @PrimaryGeneratedColumn('uuid')
    budgetMonthId!: number;

    @ManyToOne(() => Budget, (budget) => budget.months, {
        cascade: true,
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn()
    budget!: Budget;

    @Column('integer', {
        nullable: false,
    })
    year!: number;

    @Column('integer', {
        nullable: false,
    })
    month!: number;

    @CreateDateColumn({
        type: 'timestamptz',
        nullable: false,
    })
    createdDate!: Date;

    @OneToMany(() => BudgetMonthCategory, (budgetMonthCategory) => budgetMonthCategory.budgetMonth)
    categories: BudgetMonthCategory[] | undefined;
}
