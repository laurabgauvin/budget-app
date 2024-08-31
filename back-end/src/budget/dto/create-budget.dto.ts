import { IsNotEmpty } from 'class-validator';

export class CreateBudgetDto {
    @IsNotEmpty()
    name!: string;
}
