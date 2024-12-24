import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePayeeDto {
    @ApiProperty()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    defaultCategoryId: string | undefined;
}
