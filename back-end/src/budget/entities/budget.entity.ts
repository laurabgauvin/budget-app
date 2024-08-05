import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Budget {
    @PrimaryGeneratedColumn('uuid')
    budget_id!: string;

    @Column('text')
    name: string | undefined;

    @Column('integer')
    month: number | undefined;

    @Column('integer')
    year: number | undefined;
}
