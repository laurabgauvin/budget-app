import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionTag } from './transaction-tag.entity';

@Entity('tag')
export class Tag {
    @PrimaryGeneratedColumn('uuid', {
        name: 'tag_id',
        primaryKeyConstraintName: 'tag_pkey',
    })
    tagId!: string;

    @Column('text', {
        nullable: true,
    })
    name: string | undefined;

    @CreateDateColumn({
        type: 'timestamptz',
        name: 'created_date',
        nullable: false,
    })
    createdDate!: Date;

    @OneToMany(() => TransactionTag, (transactionTag) => transactionTag.tag)
    transactionTags: TransactionTag[] | undefined;
}
