import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAccountDto {
    @ApiProperty()
    @IsNotEmpty()
    name!: string;
}
