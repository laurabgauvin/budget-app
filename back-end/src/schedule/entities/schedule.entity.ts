import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Goal } from '../../goal/entities/goal.entity';

export enum ScheduleFrequency {
    Year = 'year',
    Month = 'month',
    Week = 'week',
    Day = 'day',
}

@Index(['frequency', 'interval'], { unique: true })
@Entity()
export class Schedule {
    @PrimaryGeneratedColumn('uuid')
    scheduleId!: string;

    @Column({
        type: 'enum',
        enum: ScheduleFrequency,
        default: ScheduleFrequency.Month,
        nullable: false,
    })
    frequency!: ScheduleFrequency;

    @Column({
        type: 'integer',
        default: 1,
        nullable: false,
    })
    interval!: number;

    @Column({
        type: 'text',
        nullable: false,
    })
    displayName!: string;

    @Column({
        type: 'boolean',
        default: true,
        nullable: false,
    })
    isEditable!: boolean;

    @Column({
        type: 'integer',
        nullable: true,
    })
    displayOrder: number | undefined;

    @CreateDateColumn({
        type: 'timestamptz',
        nullable: false,
    })
    createdDate!: Date;

    @OneToMany(() => Goal, (goal) => goal.schedule)
    goals: Goal[] | undefined;
}
