import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { AccountType } from '../entities/account.entity';

export class CreateAccountDto {
    @ApiProperty()
    @IsString()
    name!: string;

    @ApiProperty({
        enum: AccountType,
    })
    @IsEnum(AccountType)
    type!: AccountType;

    @ApiProperty()
    @IsBoolean()
    tracked!: boolean;
}
