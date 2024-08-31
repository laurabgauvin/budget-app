import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    category_id!: string;

    @Column('text')
    name: string | undefined;
}
