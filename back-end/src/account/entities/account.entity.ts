import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from '../../transaction/entities/transaction.entity';

export enum AccountType {
    Cash = 'cash',
    Checking = 'checking',
    Savings = 'savings',
    CreditCard = 'credit_card',
    LineOfCredit = 'line_of_credit',
    Mortgage = 'mortgage',
    Loan = 'loan',
    Asset = 'asset',
    Liability = 'liability',
}

@Entity('account')
@Index('account_account_id_tracked_idx', ['accountId', 'tracked'])
export class Account {
    @PrimaryGeneratedColumn('uuid', {
        name: 'account_id',
        primaryKeyConstraintName: 'account_pkey',
    })
    accountId!: string;

    @Column('text', {
        nullable: true,
    })
    name: string | undefined;

    @Column({
        type: 'numeric',
        precision: 15,
        scale: 2,
        nullable: true,
    })
    balance: number | undefined;

    @Column({
        type: 'enum',
        enum: AccountType,
        default: AccountType.Cash,
        nullable: false,
    })
    type!: AccountType;

    @Column({
        type: 'boolean',
        default: true,
        nullable: false,
    })
    tracked!: boolean;

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

    @OneToMany(() => Transaction, (transaction) => transaction.account)
    transactions: Transaction[] | undefined;
}
