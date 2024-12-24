import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BudgetMonthCategory } from '../../budget/entities/budget-month-category.entity';
import { TransactionCategory } from './transaction-category.entity';

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn('uuid', {
        name: 'category_id',
        primaryKeyConstraintName: 'category_pkey',
    })
    categoryId!: string;

    @Column('text', {
        nullable: true,
    })
    name: string | undefined;

    @CreateDateColumn({
        type: 'timestamptz',
        name: 'created_date',
        nullable: false,
    })
    createdDate!: Date;

    @OneToMany(() => BudgetMonthCategory, (budgetMonth) => budgetMonth.category)
    budgetMonths: BudgetMonthCategory[] | undefined;

    @OneToMany(() => TransactionCategory, (transactionCategory) => transactionCategory.category)
    transactionCategories: TransactionCategory[] | undefined;
}
