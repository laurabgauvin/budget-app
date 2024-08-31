import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends CreateCategoryDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    categoryId!: string;
}
