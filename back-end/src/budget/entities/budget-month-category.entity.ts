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
import { Category } from '../../category/entities/category.entity';
import { ColumnNumericTransformer } from '../../database/utilities/column-numeric.transformer';
import { BudgetMonth } from './budget-month.entity';
import { GoalMonthCategory } from './goal-month-category.entity';

@Entity()
@Index(['budgetMonth', 'category'], {
    unique: true,
})
export class BudgetMonthCategory {
    @PrimaryGeneratedColumn({
        type: 'integer',
    })
    budgetMonthCategoryId!: number;

    @ManyToOne(() => BudgetMonth, (budgetMonth) => budgetMonth.categories, {
        cascade: true,
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn()
    budgetMonth!: BudgetMonth;

    @ManyToOne(() => Category, (category) => category.budgetMonths, {
        cascade: true,
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn()
    category!: Category;

    @Column({
        type: 'numeric',
        precision: 15,
        scale: 2,
        nullable: false,
        default: 0,
        transformer: new ColumnNumericTransformer(),
    })
    amountBudgeted!: number;

    @CreateDateColumn({
        type: 'timestamptz',
        nullable: false,
    })
    createdDate!: Date;

    @OneToMany(() => GoalMonthCategory, (gmc) => gmc.budgetMonthCategory)
    goalMonthCategories: GoalMonthCategory[] | undefined;
}
