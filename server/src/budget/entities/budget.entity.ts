import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { BudgetMonth } from './budget-month.entity';

@Entity()
export class Budget {
    @PrimaryGeneratedColumn('uuid')
    budgetId!: string;

    @Column('text', { nullable: false })
    name!: string;

    @Column({
        type: 'text',
        generatedType: 'STORED',
        asExpression: `UPPER(TRIM(BOTH FROM name))`,
    })
    @Index({ unique: true })
    readonly normalizedName!: string;

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
