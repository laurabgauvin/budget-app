import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { ColumnNumericTransformer } from '../../database/utilities/column-numeric.transformer';
import { Schedule } from '../../schedule/entities/schedule.entity';

@Entity()
export class Goal {
    @PrimaryGeneratedColumn('uuid')
    goalId!: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    name: string | undefined;

    @ManyToOne(() => Category, {
        onDelete: 'RESTRICT',
        nullable: false,
    })
    @JoinColumn()
    category!: Category;

    @ManyToOne(() => Schedule, {
        onDelete: 'RESTRICT',
        nullable: true,
    })
    @JoinColumn()
    schedule: Schedule | undefined;

    @Column({
        type: 'numeric',
        precision: 15,
        scale: 2,
        nullable: true,
        transformer: new ColumnNumericTransformer(),
    })
    totalAmount: number | undefined;
}
