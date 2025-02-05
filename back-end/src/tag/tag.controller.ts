import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagInfoDto } from './dto/tag-info.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagService } from './tag.service';

@ApiTags('Tag')
@Controller('tag')
export class TagController {
    constructor(private readonly _tagService: TagService) {}

    @Get()
    getAllTags(): Promise<TagInfoDto[]> {
        return this._tagService.getAllTagInfos();
    }

    @Post()
    createTag(@Body() dto: CreateTagDto): Promise<string | null> {
        return this._tagService.createTag(dto);
    }

    @Put()
    updateTag(@Body() dto: UpdateTagDto): Promise<boolean> {
        return this._tagService.updateTag(dto);
    }

    @Delete(':id')
    deleteTag(@Param('id', ParseUUIDPipe) id: string): Promise<boolean> {
        return this._tagService.deleteTag(id);
    }
}
