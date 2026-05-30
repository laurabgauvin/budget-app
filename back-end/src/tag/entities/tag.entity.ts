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
        nullable: false,
    })
    name!: string;

    @Column({
        type: 'text',
        generatedType: 'STORED',
        asExpression: `UPPER(TRIM(BOTH FROM name))`,
    })
    @Index({ unique: true })
    readonly normalizedName!: string;

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
