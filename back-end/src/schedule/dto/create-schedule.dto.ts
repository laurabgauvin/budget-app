import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { ScheduleFrequency } from '../entities/schedule.entity';

export class CreateScheduleDto {
    @ApiProperty()
    @IsString()
    displayName!: string;

    @ApiProperty({ enum: ScheduleFrequency })
    @IsEnum(ScheduleFrequency)
    frequency!: ScheduleFrequency;

    @ApiProperty()
    @IsNumber()
    interval!: number;

    @ApiProperty()
    @IsNumber()
    displayOrder!: number;
}
