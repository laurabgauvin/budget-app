import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';

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

@Entity()
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

    @OneToMany(() => Transaction, (transaction) => transaction.account)
    transactions: Transaction[] | undefined;
}
