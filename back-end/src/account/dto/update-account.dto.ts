import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateAccountDto } from './create-account.dto';

export class UpdateAccountDto extends OmitType(CreateAccountDto, ['balance']) {
    @ApiProperty()
    @IsUUID()
    accountId!: string;
}
