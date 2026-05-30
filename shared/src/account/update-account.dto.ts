import { CreateAccountDto } from './create-account.dto.js';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UpdateAccount } from './update-account.js';
import { IsUUID } from 'class-validator';

export class UpdateAccountDto
    extends OmitType(CreateAccountDto, ['balance'])
    implements UpdateAccount
{
    @ApiProperty({ type: 'string' })
    @IsUUID()
    accountId!: string;
}
