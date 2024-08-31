import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity()
export class Account {
    @PrimaryGeneratedColumn('uuid', {
        primaryKeyConstraintName: 'account_pkey',
    })
    account_id!: string;

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

    @OneToMany(() => Transaction, (transaction) => transaction.account)
    transactions: Transaction[] | undefined;
}
