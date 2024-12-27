import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateBudgetDto } from './create-budget.dto';

export class UpdateBudgetDto extends CreateBudgetDto {
    @ApiProperty()
    @IsUUID()
    budgetId!: string;
}
