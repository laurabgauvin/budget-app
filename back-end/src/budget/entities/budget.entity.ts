import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BudgetMonth } from './budget-month.entity';

@Entity()
export class Budget {
    @PrimaryGeneratedColumn('uuid', {
        name: 'budget_id',
        primaryKeyConstraintName: 'budget_pkey',
    })
    budgetId!: string;

    @Column('text', { nullable: true })
    name: string | undefined;

    @DeleteDateColumn()
    @Column('date', {
        name: 'deleted_date',
        nullable: true,
    })
    deletedDate: Date | undefined;

    @OneToMany(() => BudgetMonth, (month) => month.budget)
    months: BudgetMonth[] | undefined;
}
