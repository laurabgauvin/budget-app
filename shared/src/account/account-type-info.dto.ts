import { AccountTypeInfo } from './account-type-info.js';
import { AccountType } from '../shared/enum.js';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class AccountTypeInfoDto implements AccountTypeInfo {
    @ApiProperty({ enum: AccountType })
    @IsEnum(() => AccountType)
    type!: AccountType;

    @ApiProperty({ type: 'string' })
    @IsString()
    displayName!: string;

    @ApiProperty({ type: 'string' })
    @IsString()
    categoryHeader!: string;
}
