import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateTransactionDto } from './create-transaction.dto';

export class UpdateTransactionDto extends CreateTransactionDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    transactionId!: string;
}
