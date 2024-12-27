import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity()
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

    @ManyToMany(() => Transaction, (t) => t.tags)
    transactions: Transaction[] | undefined;
}
