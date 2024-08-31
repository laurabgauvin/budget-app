import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateAccountDto } from './create-account.dto';

export class UpdateAccountDto extends CreateAccountDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    accountId!: string;
}
