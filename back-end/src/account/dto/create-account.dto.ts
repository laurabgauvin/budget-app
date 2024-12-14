import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';
import { AccountType } from '../entities/account.entity';

export class CreateAccountDto {
    @ApiProperty()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        enum: AccountType,
    })
    @IsNotEmpty()
    @IsEnum(AccountType)
    type!: AccountType;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    tracked!: boolean;
}
