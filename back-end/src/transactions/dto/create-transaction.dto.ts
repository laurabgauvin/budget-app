import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsString, IsUUID, ValidateNested } from 'class-validator';
import { TransactionStatus } from '../entities/transaction.entity';

export class TransactionCategoryDto {
    @ApiProperty()
    @IsUUID()
    categoryId!: string;

    @ApiProperty({
        type: 'number',
    })
    @IsNumber({
        maxDecimalPlaces: 2,
    })
    amount!: number;

    @ApiProperty()
    @IsString()
    notes!: string;

    @ApiProperty()
    @IsNumber()
    order!: number;
}

export class CreateTransactionDto {
    @ApiProperty()
    @IsDateString({ strict: true })
    date!: Date;

    @ApiProperty()
    @IsUUID()
    accountId!: string;

    @ApiProperty()
    @IsUUID()
    payeeId!: string;

    @ApiProperty({
        type: 'number',
    })
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
    @IsEnum(TransactionStatus)
    status!: TransactionStatus;

    @ApiProperty({
        type: TransactionCategoryDto,
        isArray: true,
    })
    @ValidateNested()
    @Type(() => TransactionCategoryDto)
    categories!: TransactionCategoryDto[];

    @ApiProperty({
        type: 'string',
        isArray: true,
    })
    @IsUUID('all', { each: true })
    tags!: string[];
}
