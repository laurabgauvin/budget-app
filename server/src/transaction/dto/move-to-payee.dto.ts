import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class MoveToPayeeDto {
    @ApiProperty()
    @IsUUID()
    oldPayeeId!: string;

    @ApiProperty()
    @IsUUID()
    newPayeeId!: string;
}
