import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '../../account/entities/account.entity';
import { TransactionCategory } from '../../category/entities/transaction-category.entity';
import { Payee } from '../../payee/entities/payee.entity';
import { TransactionTag } from '../../tags/entities/transaction-tag.entity';

export enum TransactionStatus {
    Pending = 'pending',
    Cleared = 'cleared',
}

@Entity()
@Index('transaction_account_id_date_idx', ['account', 'date'])
export class Transaction {
    @PrimaryGeneratedColumn('uuid', {
        name: 'transaction_id',
        primaryKeyConstraintName: 'transaction_pkey',
    })
    transactionId!: string;

    @Column('date', {
        nullable: true,
    })
    date: Date | undefined;

    @ManyToOne(() => Account, (account) => account.transactions, {
        cascade: true,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'account_id',
        referencedColumnName: 'accountId',
        foreignKeyConstraintName: 'transaction_account_id_fkey',
    })
    account!: Account;

    @ManyToOne(() => Payee, (payee) => payee.transactions, {
        cascade: true,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'payee_id',
        referencedColumnName: 'payeeId',
        foreignKeyConstraintName: 'transaction_payee_id_fkey',
    })
    payee!: Payee;

    @Column({
        type: 'numeric',
        name: 'total_amount',
        precision: 15,
        scale: 2,
        nullable: true,
    })
    totalAmount: number | undefined;

    @Column('text', {
        nullable: true,
    })
    notes: string | undefined;

    @Column({
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.Pending,
        nullable: false,
    })
    status!: TransactionStatus;

    @OneToMany(() => TransactionTag, (transactionTag) => transactionTag.transaction)
    transactionTags: TransactionTag[] | undefined;

    @OneToMany(() => TransactionCategory, (transactionCategory) => transactionCategory.transaction)
    transactionCategories: TransactionCategory[] | undefined;
}
