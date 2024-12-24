import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { BudgetMonth } from './budget-month.entity';

@Entity('budget')
export class Budget {
    @PrimaryGeneratedColumn('uuid', {
        name: 'budget_id',
        primaryKeyConstraintName: 'budget_pkey',
    })
    budgetId!: string;

    @Column('text', { nullable: true })
    name: string | undefined;

    @CreateDateColumn({
        type: 'timestamptz',
        name: 'created_date',
        nullable: false,
    })
    createdDate!: Date;

    @DeleteDateColumn({
        type: 'timestamptz',
        name: 'deleted_date',
        nullable: true,
    })
    deletedDate: Date | undefined;

    @OneToMany(() => BudgetMonth, (month) => month.budget)
    months: BudgetMonth[] | undefined;
}
