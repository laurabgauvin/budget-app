import { IsNotEmpty } from 'class-validator';

export class CreateBudgetDto {
    @IsNotEmpty()
    name!: string;

    @IsNotEmpty()
    year!: number;

    @IsNotEmpty()
    month!: number;
}
