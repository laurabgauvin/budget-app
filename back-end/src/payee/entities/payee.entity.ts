import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity('payee')
export class Payee {
    @PrimaryGeneratedColumn('uuid', {
        name: 'payee_id',
        primaryKeyConstraintName: 'payee_pkey',
    })
    payeeId!: string;

    @Column('text', {
        nullable: true,
    })
    name: string | undefined;

    @ManyToOne(() => Category, {
        onDelete: 'SET NULL',
    })
    @JoinColumn({
        name: 'default_category_id',
        referencedColumnName: 'categoryId',
        foreignKeyConstraintName: 'payee_default_category_id_fkey',
    })
    defaultCategory: Category | undefined;

    @CreateDateColumn({
        type: 'timestamptz',
        name: 'created_date',
        nullable: false,
    })
    createdDate!: Date;

    @OneToMany(() => Transaction, (transaction) => transaction.payee)
    transactions: Transaction[] | undefined;
}
