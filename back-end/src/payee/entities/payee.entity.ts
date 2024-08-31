import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity()
export class Payee {
    @PrimaryGeneratedColumn('uuid', {
        primaryKeyConstraintName: 'payee_pkey',
    })
    payee_id!: string;

    @Column('text', {
        nullable: true,
    })
    name: string | undefined;

    @Column('uuid', {
        name: 'default_category_id',
        nullable: true,
    })
    @ManyToOne(() => Category, {
        onDelete: 'SET NULL',
    })
    @JoinColumn({
        name: 'default_category_id',
        referencedColumnName: 'category_id',
        foreignKeyConstraintName: 'payee_default_category_id_fkey',
    })
    default_category: Category | undefined;

    @OneToMany(() => Transaction, (transaction) => transaction.payee)
    transactions: Transaction[] | undefined;
}
