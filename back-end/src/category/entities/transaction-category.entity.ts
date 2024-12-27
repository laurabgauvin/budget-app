import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { Category } from './category.entity';

@Entity()
@Index(['transaction', 'category'])
@Index(['transaction', 'order'])
@Index(['transaction', 'category', 'order'], { unique: true })
export class TransactionCategory {
    @PrimaryGeneratedColumn({
        type: 'integer',
    })
    transactionCategoryId!: number;

    @ManyToOne(() => Transaction, (transaction) => transaction.transactionCategories, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    @Index()
    transaction!: Transaction;

    @ManyToOne(() => Category, (category) => category.transactionCategories, {
        cascade: true,
        onDelete: 'RESTRICT',
    })
    @JoinColumn()
    @Index()
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

    @Column({
        type: 'integer',
        nullable: false,
        default: 0,
    })
    order!: number;

    @CreateDateColumn({
        type: 'timestamptz',
        nullable: false,
    })
    createdDate!: Date;
}
