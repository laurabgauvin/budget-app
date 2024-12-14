import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Tag } from './tag.entity';

@Entity()
@Index('transaction_tag_transaction_id_tag_id_idx', ['transaction', 'tag'], { unique: true })
export class TransactionTag {
    @PrimaryGeneratedColumn({
        type: 'integer',
        primaryKeyConstraintName: 'transaction_tag_pkey',
    })
    transaction_tag_id!: number;

    @Column('uuid', {
        name: 'transaction_id',
        nullable: false,
    })
    @ManyToOne(() => Transaction, (transaction) => transaction.transaction_tags, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'transaction_id',
        foreignKeyConstraintName: 'transaction_tag_transaction_id_fkey',
    })
    transaction!: Transaction;

    @Column('uuid', {
        name: 'tag_id',
        nullable: false,
    })
    @ManyToOne(() => Tag, (tag) => tag.transaction_tags, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'tag_id',
        foreignKeyConstraintName: 'transaction_tag_tag_id_fkey',
    })
    tag!: Tag;
}
