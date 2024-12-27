import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBudgetDto {
    @ApiProperty()
    @IsString()
    name!: string;
}
