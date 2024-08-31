import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreatePayeeDto } from './create-payee.dto';

export class UpdatePayeeDto extends CreatePayeeDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    payeeId!: string;
}
