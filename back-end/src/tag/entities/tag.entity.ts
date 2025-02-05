import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity()
@Index(['tagId', 'name'])
export class Tag {
    @PrimaryGeneratedColumn('uuid')
    tagId!: string;

    @Column({
        type: 'text',
        nullable: true,
        unique: true,
    })
    name: string | undefined;

    @Column({
        type: 'boolean',
        default: true,
        nullable: false,
    })
    isEditable!: boolean;

    @Column({
        type: 'boolean',
        default: true,
        nullable: false,
    })
    show!: boolean;

    @Column({
        type: 'text',
        nullable: true,
    })
    color: string | undefined;

    @CreateDateColumn({
        type: 'timestamptz',
        nullable: false,
    })
    createdDate!: Date;

    @ManyToMany(() => Transaction, (t) => t.tags, {
        onDelete: 'CASCADE',
    })
    transactions: Transaction[] | undefined;
}
