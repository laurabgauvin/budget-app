import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePayeeDto {
    @ApiProperty()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        type: 'uuid',
        required: false,
    })
    defaultCategoryId: string | undefined;
}
