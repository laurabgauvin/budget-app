import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ColumnNumericTransformer } from '../../database/utilities/column-numeric.transformer';
import { Goal } from '../../goal/entities/goal.entity';
import { BudgetMonthCategory } from './budget-month-category.entity';

@Entity()
@Index(['goal', 'budgetMonthCategory'], {
    unique: true,
})
export class GoalMonthCategory {
    @PrimaryGeneratedColumn({
        type: 'integer',
    })
    goalMonthCategoryId!: number;

    @ManyToOne(() => Goal, (goal) => goal.goalMonthCategories, {
        cascade: true,
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn()
    goal!: Goal;

    @ManyToOne(() => BudgetMonthCategory, (bmc) => bmc.goalMonthCategories, {
        cascade: true,
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn()
    budgetMonthCategory!: BudgetMonthCategory;

    @Column({
        type: 'numeric',
        precision: 15,
        scale: 2,
        nullable: true,
        transformer: new ColumnNumericTransformer(),
    })
    amountToBudget: number | undefined;

    @Column({
        type: 'numeric',
        precision: 15,
        scale: 2,
        nullable: true,
        transformer: new ColumnNumericTransformer(),
    })
    amountBudgeted: number | undefined;

    @Column({
        type: 'boolean',
        generatedType: 'STORED',
        asExpression: `COALESCE("amount_budgeted", 0) >= COALESCE("amount_to_budget", 0)`,
    })
    readonly isAmountMet!: boolean;

    @CreateDateColumn({
        type: 'timestamptz',
        nullable: false,
    })
    createdDate!: Date;
}
