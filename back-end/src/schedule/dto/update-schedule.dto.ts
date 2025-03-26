import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateScheduleDto } from './create-schedule.dto';

export class UpdateScheduleDto extends CreateScheduleDto {
    @ApiProperty()
    @IsUUID()
    scheduleId!: string;
}
