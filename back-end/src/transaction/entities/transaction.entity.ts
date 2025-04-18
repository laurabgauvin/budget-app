import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '../../account/entities/account.entity';
import { TransactionCategory } from '../../category/entities/transaction-category.entity';
import { ColumnNumericTransformer } from '../../database/utilities/column-numeric.transformer';
import { Payee } from '../../payee/entities/payee.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { Tag } from '../../tag/entities/tag.entity';

export enum TransactionStatus {
    Pending = 'pending',
    Cleared = 'cleared',
}

@Entity()
@Index(['account', 'date'])
@Index(['payee', 'date'])
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    transactionId!: string;

    @Column('date', {
        nullable: true,
    })
    date: Date | undefined;

    @ManyToOne(() => Schedule, (schedule) => schedule.scheduledTransactions, {
        onDelete: 'RESTRICT',
        nullable: true,
    })
    @JoinColumn()
    schedule: Schedule | undefined | null;

    @ManyToOne(() => Account, (account) => account.transactions, {
        cascade: true,
        onDelete: 'RESTRICT',
        nullable: false,
    })
    @JoinColumn()
    @Index()
    account: Account | undefined; // Note: may be undefined if the account linked has been soft-deleted

    @ManyToOne(() => Payee, (payee) => payee.transactions, {
        cascade: true,
        onDelete: 'RESTRICT',
        nullable: false,
    })
    @JoinColumn()
    @Index()
    payee!: Payee;

    @Column({
        type: 'numeric',
        precision: 15,
        scale: 2,
        nullable: true,
        transformer: new ColumnNumericTransformer(),
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

    @CreateDateColumn({
        type: 'timestamptz',
        nullable: false,
    })
    createdDate!: Date;

    @ManyToMany(() => Tag, (tag) => tag.transactions, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinTable()
    tags: Tag[] | undefined;

    @OneToMany(() => TransactionCategory, (transactionCategory) => transactionCategory.transaction)
    transactionCategories: TransactionCategory[] | undefined;
}
