import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { TransactionStatus } from '../entities/transaction.entity';

export class TransactionCategoryDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    categoryId!: string;

    @ApiProperty({
        type: 'number',
    })
    @IsNotEmpty()
    @IsNumber({
        maxDecimalPlaces: 2,
    })
    amount!: number;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    notes: string | undefined;
}

export class CreateTransactionDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    date!: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    accountId!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    payeeId!: string;

    @ApiProperty({
        type: 'number',
    })
    @IsNotEmpty()
    @IsNumber({
        maxDecimalPlaces: 2,
    })
    amount!: number;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    notes: string | undefined;

    @ApiProperty({
        enum: TransactionStatus,
    })
    @IsNotEmpty()
    @IsEnum(TransactionStatus)
    status!: TransactionStatus;

    @ApiProperty({
        type: TransactionCategoryDto,
        isArray: true,
    })
    @IsNotEmpty()
    categories!: TransactionCategoryDto[];

    @ApiProperty({
        type: 'string',
        required: false,
        isArray: true,
    })
    tags: string[] | undefined;
}
