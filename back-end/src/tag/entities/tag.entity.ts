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

    @Column('text', {
        nullable: true,
    })
    name: string | undefined;

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
