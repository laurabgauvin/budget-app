import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBudgetDto {
    @ApiProperty()
    @IsNotEmpty()
    name!: string;
}
