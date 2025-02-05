import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateTagDto {
    @ApiProperty()
    @IsString()
    name!: string;

    @ApiProperty()
    @IsBoolean()
    show!: boolean;

    @ApiProperty()
    @IsString()
    color!: string;
}
