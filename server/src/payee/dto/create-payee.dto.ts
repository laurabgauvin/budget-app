import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePayeeDto {
    @ApiProperty()
    @IsString()
    name!: string;

    @ApiProperty()
    @IsString()
    defaultCategoryId!: string;
}
