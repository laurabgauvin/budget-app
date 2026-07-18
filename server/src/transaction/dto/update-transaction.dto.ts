import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateTransactionDto } from './create-transaction.dto';

export class UpdateTransactionDto extends CreateTransactionDto {
    @ApiProperty()
    @IsUUID()
    transactionId!: string;
}
