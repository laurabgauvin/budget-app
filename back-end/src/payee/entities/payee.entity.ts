import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';

export enum PayeeType {
    UserDefined = 'user-defined',
    StartingBalance = 'starting-balance',
}

@Entity()
export class Payee {
    @PrimaryGeneratedColumn('uuid')
    payeeId!: string;

    @Column('text', {
        nullable: true,
        unique: true,
    })
    name: string | undefined;

    @ManyToOne(() => Category, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    defaultCategory: Category | undefined | null;

    @CreateDateColumn({
        type: 'timestamptz',
        nullable: false,
    })
    createdDate!: Date;

    @Column({
        type: 'enum',
        enum: PayeeType,
        default: PayeeType.UserDefined,
        nullable: false,
    })
    @Index({ unique: true, where: `type = '${PayeeType.StartingBalance}'` })
    type!: PayeeType;

    @OneToMany(() => Transaction, (transaction) => transaction.payee)
    transactions: Transaction[] | undefined;
}
