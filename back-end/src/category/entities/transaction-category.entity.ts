import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ColumnNumericTransformer } from '../../database/utilities/column-numeric.transformer';
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
        nullable: false,
    })
    @JoinColumn()
    @Index()
    transaction!: Transaction;

    @ManyToOne(() => Category, (category) => category.transactionCategories, {
        cascade: true,
        onDelete: 'RESTRICT',
        nullable: false,
    })
    @JoinColumn()
    @Index()
    category!: Category;

    @Column({
        type: 'numeric',
        precision: 15,
        scale: 2,
        nullable: true,
        transformer: new ColumnNumericTransformer(),
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
