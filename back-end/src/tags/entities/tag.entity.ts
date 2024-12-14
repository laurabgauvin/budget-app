import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionTag } from './transaction-tag.entity';

@Entity()
export class Tag {
    @PrimaryGeneratedColumn('uuid', {
        primaryKeyConstraintName: 'tag_pkey',
    })
    tag_id!: string;

    @Column('text', {
        nullable: true,
    })
    name: string | undefined;

    @OneToMany(() => TransactionTag, (transactionTag) => transactionTag.tag)
    transaction_tags: TransactionTag[] | undefined;
}
