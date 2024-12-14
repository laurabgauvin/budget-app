import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BudgetMonth } from './budget-month.entity';

@Entity()
export class Budget {
    @PrimaryGeneratedColumn('uuid', {
        primaryKeyConstraintName: 'budget_pkey',
    })
    budget_id!: string;

    @Column('text', { nullable: true })
    name: string | undefined;

    @OneToMany(() => BudgetMonth, (month) => month.budget)
    months: BudgetMonth[] | undefined;

    @DeleteDateColumn()
    @Column('date', { nullable: true })
    deleted_date: Date | undefined;
}
