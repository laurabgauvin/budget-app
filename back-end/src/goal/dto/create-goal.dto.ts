import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateGoalDto {
    @ApiProperty()
    @IsString()
    name!: string;

    @ApiProperty({ type: 'string', required: false })
    @IsOptional()
    @IsString()
    description: string | undefined;

    @ApiProperty()
    @IsUUID()
    categoryId!: string;

    @ApiProperty({ type: 'number' })
    @IsNumber({ maxDecimalPlaces: 2 })
    amount!: number;

    @ApiProperty({ type: 'string', required: false })
    @IsOptional()
    @IsDateString({ strict: true })
    startDate: Date | undefined;

    @ApiProperty({ type: 'string', required: false })
    @IsOptional()
    @IsDateString({ strict: true })
    endDate: Date | undefined;

    @ApiProperty({ type: 'string', required: false })
    @IsOptional()
    @IsUUID()
    scheduleId: string | undefined;
}
