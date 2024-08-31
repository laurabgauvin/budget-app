import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateBudgetDto } from './create-budget.dto';

export class UpdateBudgetDto extends CreateBudgetDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    budgetId!: string;
}
