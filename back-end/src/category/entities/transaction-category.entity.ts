import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Category } from './category.entity';

@Entity()
export class TransactionCategory {
    @PrimaryGeneratedColumn({
        type: 'integer',
        name: 'transaction_category_id',
        primaryKeyConstraintName: 'transaction_category_pkey',
    })
    transactionCategoryId!: number;

    @ManyToOne(() => Transaction, (transaction) => transaction.transactionCategories, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'transaction_id',
        referencedColumnName: 'transactionId',
        foreignKeyConstraintName: 'transaction_category_transaction_id_fkey',
    })
    @Index('transaction_category_transaction_id_idx')
    transaction!: Transaction;

    @ManyToOne(() => Category, (category) => category.transactionCategories, {
        cascade: true,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'category_id',
        referencedColumnName: 'categoryId',
        foreignKeyConstraintName: 'transaction_category_category_id_fkey',
    })
    category!: Category;

    @Column({
        type: 'numeric',
        precision: 15,
        scale: 2,
        nullable: true,
    })
    amount: number | undefined;

    @Column('text', {
        nullable: true,
    })
    notes: string | undefined;
}
