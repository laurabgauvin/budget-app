import { AccountInfo } from './account-info.js';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, IsUUID } from 'class-validator';
import { AccountTypeInfoDto } from './account-type-info.dto.js';

export class AccountInfoDto implements AccountInfo {
    @ApiProperty({ type: 'string' })
    @IsUUID()
    accountId!: string;

    @ApiProperty({ type: 'string' })
    @IsString()
    name!: string;

    @ApiProperty({ type: AccountTypeInfoDto })
    @Type(() => AccountTypeInfoDto)
    type!: AccountTypeInfoDto;

    @ApiProperty({ type: 'number' })
    @IsNumber()
    balance!: number;

    @ApiProperty({ type: 'boolean' })
    @IsBoolean()
    tracked!: boolean;
}
