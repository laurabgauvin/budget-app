import { ScheduleFrequency } from '../entities/schedule.entity';

export interface ScheduleInfoDto {
    scheduleId: string;
    displayName: string;
    frequency: ScheduleFrequency;
    interval: number | undefined;
    displayOrder: number | undefined;
    isEditable: boolean;
}
