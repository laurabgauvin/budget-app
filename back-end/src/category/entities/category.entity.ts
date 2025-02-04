import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BudgetMonthCategory } from '../../budget/entities/budget-month-category.entity';
import { Goal } from '../../goal/entities/goal.entity';
import { TransactionCategory } from './transaction-category.entity';

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    categoryId!: string;

    @Column({
        type: 'text',
        nullable: true,
        unique: true,
    })
    name: string | undefined;

    @Column({
        type: 'boolean',
        default: true,
        nullable: false,
    })
    isEditable!: boolean;

    @CreateDateColumn({
        type: 'timestamptz',
        nullable: false,
    })
    createdDate!: Date;

    @OneToMany(() => BudgetMonthCategory, (budgetMonth) => budgetMonth.category)
    budgetMonths: BudgetMonthCategory[] | undefined;

    @OneToMany(() => TransactionCategory, (transactionCategory) => transactionCategory.category)
    transactionCategories: TransactionCategory[] | undefined;

    @OneToMany(() => Goal, (goal) => goal.category)
    goals: Goal[] | undefined;
}
