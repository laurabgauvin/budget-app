import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Goal } from '../../goal/entities/goal.entity';

export enum ScheduleEvery {
    None = 'none',
    Year = 'year',
    Month = 'month',
    Week = 'week',
    Day = 'day',
}

@Entity()
export class Schedule {
    @PrimaryGeneratedColumn({
        type: 'integer',
    })
    scheduleId!: number;

    @Column({
        type: 'enum',
        enum: ScheduleEvery,
        default: ScheduleEvery.None,
        nullable: false,
    })
    every!: ScheduleEvery;

    @Column({
        type: 'integer',
        default: 1,
        nullable: false,
    })
    count!: number;

    @OneToMany(() => Goal, (goal) => goal.schedule)
    goals: Goal[] | undefined;
}
