import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateTagDto } from './create-tag.dto';

export class UpdateTagDto extends CreateTagDto {
    @ApiProperty()
    @IsUUID()
    tagId!: string;
}
