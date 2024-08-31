import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateCategoryDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    categoryId!: string;

    @ApiProperty()
    @IsNotEmpty()
    name!: string;
}
