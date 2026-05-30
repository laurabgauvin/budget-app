import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { AccountType } from '../shared/enum.js';
import { CreateAccount } from './create-account.js';

export class CreateAccountDto implements CreateAccount {
    @ApiProperty({ type: 'string' })
    @IsString()
    name!: string;

    @ApiProperty({ enum: AccountType })
    @IsEnum(AccountType)
    type!: AccountType;

    @ApiProperty({ type: 'boolean' })
    @IsBoolean()
    tracked!: boolean;

    @ApiProperty({ type: 'number', required: false })
    @IsNumber({ maxDecimalPlaces: 2 })
    balance: number | undefined;
}
