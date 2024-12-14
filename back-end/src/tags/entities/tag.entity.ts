import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionTag } from './transaction-tag.entity';

@Entity()
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

    @OneToMany(() => TransactionTag, (transactionTag) => transactionTag.tag)
    transactionTags: TransactionTag[] | undefined;
}
