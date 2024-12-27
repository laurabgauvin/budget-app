import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreatePayeeDto } from './create-payee.dto';

export class UpdatePayeeDto extends CreatePayeeDto {
    @ApiProperty()
    @IsUUID()
    payeeId!: string;
}
