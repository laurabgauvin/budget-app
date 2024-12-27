import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity()
export class Payee {
    @PrimaryGeneratedColumn('uuid')
    payeeId!: string;

    @Column('text', {
        nullable: true,
    })
    name: string | undefined;

    @ManyToOne(() => Category, {
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    defaultCategory: Category | undefined;

    @CreateDateColumn({
        type: 'timestamptz',
        nullable: false,
    })
    createdDate!: Date;

    @OneToMany(() => Transaction, (transaction) => transaction.payee)
    transactions: Transaction[] | undefined;
}
