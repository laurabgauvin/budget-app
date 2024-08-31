import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateCategoryDto {
    @IsNotEmpty()
    @IsUUID()
    categoryId!: string;

    @IsNotEmpty()
    name!: string;
}
