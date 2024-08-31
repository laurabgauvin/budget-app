import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BudgetMonthCategory } from './budget-month-category.entity';

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid', {
        primaryKeyConstraintName: 'category_pkey',
    })
    category_id!: string;

    @Column('text', {
        nullable: true,
    })
    name: string | undefined;

    @OneToMany(() => BudgetMonthCategory, (budgetMonth) => budgetMonth.category)
    budgetMonths: BudgetMonthCategory[] | undefined;
}
