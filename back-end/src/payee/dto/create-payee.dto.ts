import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePayeeDto {
    @ApiProperty()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @IsUUID()
    defaultCategoryId: string | undefined;
}
