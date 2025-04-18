import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { GoalMonthCategory } from '../../budget/entities/goal-month-category.entity';
import { Category } from '../../category/entities/category.entity';
import { ColumnNumericTransformer } from '../../database/utilities/column-numeric.transformer';
import { Schedule } from '../../schedule/entities/schedule.entity';

@Entity()
export class Goal {
    @PrimaryGeneratedColumn('uuid')
    goalId!: string;

    @Column({
        type: 'text',
        nullable: false,
    })
    name!: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    description: string | undefined;

    @ManyToOne(() => Category, {
        onDelete: 'RESTRICT',
        nullable: false,
    })
    @JoinColumn()
    category!: Category;

    @Column({
        type: 'numeric',
        precision: 15,
        scale: 2,
        nullable: true,
        transformer: new ColumnNumericTransformer(),
    })
    totalAmount: number | undefined;

    @Column('date', {
        nullable: true,
    })
    startDate: Date | undefined;

    @Column('date', {
        nullable: true,
    })
    endDate: Date | undefined;

    @ManyToOne(() => Schedule, {
        onDelete: 'RESTRICT',
        nullable: true,
    })
    @JoinColumn()
    schedule: Schedule | undefined;

    @CreateDateColumn({
        type: 'timestamptz',
        nullable: false,
    })
    createdDate!: Date;

    @DeleteDateColumn({
        type: 'timestamptz',
        nullable: true,
    })
    @Index()
    deletedDate: Date | undefined;

    @OneToMany(() => GoalMonthCategory, (gmc) => gmc.budgetMonthCategory)
    goalMonthCategories: GoalMonthCategory[] | undefined;
}
