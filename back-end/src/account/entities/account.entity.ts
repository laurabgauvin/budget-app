import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ColumnNumericTransformer } from '../../database/utilities/column-numeric.transformer';
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

@Entity()
@Index(['accountId', 'tracked'])
export class Account {
    @PrimaryGeneratedColumn('uuid')
    accountId!: string;

    @Column('text', {
        nullable: true,
        unique: true,
    })
    name: string | undefined;

    @Column({
        type: 'numeric',
        precision: 15,
        scale: 2,
        nullable: true,
        transformer: new ColumnNumericTransformer(),
    })
    readonly balance: number | undefined;

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
        nullable: false,
    })
    createdDate!: Date;

    @DeleteDateColumn({
        type: 'timestamptz',
        nullable: true,
    })
    deletedDate: Date | undefined;

    @OneToMany(() => Transaction, (transaction) => transaction.account)
    transactions: Transaction[] | undefined;
}
