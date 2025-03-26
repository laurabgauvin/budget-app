import { ScheduleDaysOfWeek, ScheduleFrequency } from '../entities/schedule.entity';

export interface ScheduleInfoDto {
    scheduleId: string;
    frequency: ScheduleFrequency;
    interval: number | undefined;
    every: number | undefined;
    startDate: Date;
    endDate: Date | undefined;
    onDaysOfWeek: ScheduleDaysOfWeek[] | undefined;
    onDays: number[] | undefined;
    onMonth: number | undefined;
}
