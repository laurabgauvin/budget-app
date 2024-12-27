import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePayeeDto {
    @ApiProperty()
    @IsString()
    name!: string;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    defaultCategoryId: string | undefined;
}
