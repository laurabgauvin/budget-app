import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Goal } from '../../goal/entities/goal.entity';

export enum ScheduleFrequency {
    None = 'none',
    Year = 'year',
    Month = 'month',
    Week = 'week',
    Day = 'day',
}

export enum ScheduleDaysOfWeek {
    Monday = 'monday',
    Tuesday = 'tuesday',
    Wednesday = 'wednesday',
    Thursday = 'thursday',
    Friday = 'friday',
    Saturday = 'saturday',
    Sunday = 'sunday',
}

/* Example of schedules:
- Every 1 {FrequencyInterval} month {Frequency} on the 15 and EOM {OnDays (EOM = 32)}
- Every 1 {FrequencyInterval} month {Frequency} on the 3rd {Every} Monday {OnDaysOfWeek}
- Every 1 {FrequencyInterval} month {Frequency} on the last {Every (last = 7)} Friday {OnDaysOfWeek}
- Every 2 {FrequencyInterval} week  {Frequency} on Friday {OnDaysOfWeek}
- Every 1 {FrequencyInterval} week  {Frequency} on Monday, Tuesday, Friday {OnDaysOfWeek}
- Every 1 {FrequencyInterval} year  {Frequency} on January {OnMonth} 15 {OnDays}
- Every 1 {FrequencyInterval} year  {Frequency} on the 2nd {Every} Tuesday {OnDaysOfWeek} of March {OnMonth}
- Every 2 {FrequencyInterval} days  {Frequency}
 */
@Entity()
export class Schedule {
    @PrimaryGeneratedColumn('uuid')
    scheduleId!: string;

    @Column({
        type: 'enum',
        enum: ScheduleFrequency,
        default: ScheduleFrequency.None,
        nullable: false,
    })
    frequency!: ScheduleFrequency;

    @Column({
        type: 'integer',
        default: 1,
        nullable: false,
    })
    frequencyInterval!: number;

    @Column({
        type: 'integer',
        default: 1,
        nullable: false,
    })
    every!: number;

    @Column({
        type: 'date',
        default: () => 'CURRENT_DATE',
        nullable: false,
    })
    startDate!: Date;

    @Column({
        type: 'date',
        nullable: true,
    })
    endDate: Date | undefined;

    @Column({
        type: 'enum',
        array: true,
        enum: ScheduleDaysOfWeek,
        nullable: true,
    })
    onDaysOfWeek: ScheduleDaysOfWeek[] | undefined;

    @Column({
        type: 'integer',
        array: true,
        nullable: true,
    })
    onDays: number[] | undefined;

    // January = 1
    @Column({
        type: 'integer',
        nullable: true,
    })
    onMonth: number | undefined;

    @CreateDateColumn({
        type: 'timestamptz',
        nullable: false,
    })
    createdDate!: Date;

    @OneToMany(() => Goal, (goal) => goal.schedule)
    goals: Goal[] | undefined;
}
