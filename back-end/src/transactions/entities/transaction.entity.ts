import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from '../../account/entities/account.entity';
import { Payee } from '../../payee/entities/payee.entity';
import { TransactionTag } from '../../tags/entities/transaction-tag.entity';

export enum TransactionStatus {
    New = 'new',
    Cleared = 'cleared',
}

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn('uuid', {
        primaryKeyConstraintName: 'transaction_pkey',
    })
    transaction_id!: string;

    @Column('date', {
        nullable: true,
    })
    date: Date | undefined;

    @Column('uuid', {
        name: 'account_id',
        nullable: false,
    })
    @ManyToOne(() => Account, (account) => account.transactions, {
        cascade: true,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'account_id', foreignKeyConstraintName: 'transaction_account_id_fkey' })
    account!: Account;

    @Column('uuid', {
        name: 'payee_id',
        nullable: false,
    })
    @ManyToOne(() => Payee, (payee) => payee.transactions, {
        cascade: true,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'payee_id', foreignKeyConstraintName: 'transaction_payee_id_fkey' })
    payee!: Payee;

    @Column({
        type: 'numeric',
        precision: 15,
        scale: 2,
        nullable: true,
    })
    total_amount: number | undefined;

    @Column('text', {
        nullable: true,
    })
    notes: string | undefined;

    @Column({
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.New,
        nullable: false,
    })
    status!: TransactionStatus;

    @OneToMany(() => TransactionTag, (transactionTag) => transactionTag.transaction)
    transaction_tags: TransactionTag[] | undefined;
}
