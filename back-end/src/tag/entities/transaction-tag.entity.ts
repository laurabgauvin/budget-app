import {
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { Tag } from './tag.entity';

@Entity('transaction_tag')
@Index('transaction_tag_transaction_id_tag_id_idx', ['transaction', 'tag'], { unique: true })
export class TransactionTag {
    @PrimaryGeneratedColumn({
        type: 'integer',
        name: 'transaction_tag_id',
        primaryKeyConstraintName: 'transaction_tag_pkey',
    })
    transactionTagId!: number;

    @ManyToOne(() => Transaction, (transaction) => transaction.transactionTags, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'transaction_id',
        referencedColumnName: 'transactionId',
        foreignKeyConstraintName: 'transaction_tag_transaction_id_fkey',
    })
    @Index('transaction_tag_transaction_id_idx')
    transaction!: Transaction;

    @ManyToOne(() => Tag, (tag) => tag.transactionTags, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'tag_id',
        referencedColumnName: 'tagId',
        foreignKeyConstraintName: 'transaction_tag_tag_id_fkey',
    })
    @Index('transaction_tag_tag_id_idx')
    tag!: Tag;

    @CreateDateColumn({
        type: 'timestamptz',
        name: 'created_date',
        nullable: false,
    })
    createdDate!: Date;
}
