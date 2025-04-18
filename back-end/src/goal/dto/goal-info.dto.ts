import { CategoryInfoDto } from '../../category/dto/category-info.dto';
import { ScheduleInfoDto } from '../../schedule/dto/schedule-info.dto';

export interface GoalInfoDto {
    goalId: string;
    name: string | undefined;
    description: string | undefined;
    category: CategoryInfoDto | undefined;
    totalAmount: number | undefined;
    startDate: Date | undefined;
    endDate: Date | undefined;
    schedule: ScheduleInfoDto | undefined;
}
