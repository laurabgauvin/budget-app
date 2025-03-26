import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber } from 'class-validator';
import { ScheduleDaysOfWeek, ScheduleFrequency } from '../entities/schedule.entity';

export class CreateScheduleDto {
    @ApiProperty({ enum: ScheduleFrequency })
    @IsEnum(ScheduleFrequency)
    frequency!: ScheduleFrequency;

    @ApiProperty()
    @IsNumber()
    interval: number | undefined;

    @ApiProperty()
    @IsNumber()
    every: number | undefined;

    @ApiProperty()
    @IsDateString({ strict: true })
    startDate!: Date;

    @ApiProperty()
    @IsDateString()
    endDate: Date | undefined;

    @ApiProperty({
        enum: ScheduleDaysOfWeek,
        isArray: true,
    })
    @IsEnum(ScheduleDaysOfWeek)
    onDaysOfWeek: ScheduleDaysOfWeek[] | undefined;

    @ApiProperty({
        type: 'number',
        isArray: true,
    })
    @IsNumber()
    onDays: number[] | undefined;

    @ApiProperty()
    @IsNumber()
    onMonth: number | undefined;
}
