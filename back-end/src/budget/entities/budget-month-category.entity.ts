import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { ColumnNumericTransformer } from '../../database/utilities/column-numeric.transformer';
import { BudgetMonth } from './budget-month.entity';

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
    })
    @JoinColumn()
    budgetMonth!: BudgetMonth;

    @ManyToOne(() => Category, (category) => category.budgetMonths, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    category!: Category;

    @Column({
        type: 'numeric',
        precision: 15,
        scale: 2,
        nullable: true,
        transformer: new ColumnNumericTransformer(),
    })
    amountBudgeted: number | undefined;

    @CreateDateColumn({
        type: 'timestamptz',
        nullable: false,
    })
    createdDate!: Date;
}
