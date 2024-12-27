import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateAccountDto } from './create-account.dto';

export class UpdateAccountDto extends CreateAccountDto {
    @ApiProperty()
    @IsUUID()
    accountId!: string;
}
