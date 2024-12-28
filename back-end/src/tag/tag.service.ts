import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagInfoDto } from './dto/tag-info.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
    private readonly _logger = new Logger(TagService.name);

    constructor(
        @InjectRepository(Tag)
        private _tagRepository: Repository<Tag>
    ) {}

    /**
     * Get all tag info `TagInfoDto`
     */
    async getAllTagInfos(): Promise<TagInfoDto[]> {
        try {
            const tags = await this._tagRepository.find({
                order: {
                    name: 'asc',
                },
            });
            if (tags.length > 0) {
                return tags.map((t) => this._mapTagInfo(t));
            }
            return [];
        } catch (e) {
            this._logger.error('Exception when getting all tags:', e);
            return [];
        }
    }

    /**
     * Get a single tag `Tag`
     *
     * @param id
     */
    async getTagById(id: string): Promise<Tag | null> {
        try {
            return await this._tagRepository.findOneBy({ tagId: id });
        } catch (e) {
            this._logger.error('Exception when getting tag:', e);
            return null;
        }
    }

    /**
     * Get the list of tags `Tag`
     *
     * @param tagIds
     */
    async getTagsById(tagIds: string[]): Promise<Tag[]> {
        try {
            return await this._tagRepository.findBy({ tagId: In(tagIds) });
        } catch (e) {
            this._logger.error('Exception when getting tags:', e);
            return [];
        }
    }

    /**
     * Create a new tag
     *
     * @param createTagDto
     */
    async createTag(createTagDto: CreateTagDto): Promise<string | null> {
        try {
            const tag = new Tag();
            tag.name = createTagDto.name;

            const db = await this._tagRepository.save(tag);
            return db.tagId;
        } catch (e) {
            this._logger.error('Exception when creating tag:', e);
            return null;
        }
    }

    /**
     * Update an existing tag
     *
     * @param updateTagDto
     */
    async updateTag(updateTagDto: UpdateTagDto): Promise<boolean> {
        try {
            const tag = await this.getTagById(updateTagDto.tagId);
            if (tag) {
                tag.name = updateTagDto.name;

                await this._tagRepository.save(tag);
                return true;
            }
            return false;
        } catch (e) {
            this._logger.error('Exception when updating tag:', e);
            return false;
        }
    }

    /**
     * Delete an existing tag
     *
     * @param tagId
     */
    async deleteTag(tagId: string): Promise<boolean> {
        try {
            const tag = await this.getTagById(tagId);
            if (!tag) return true;

            await this._tagRepository.remove(tag);
            return true;
        } catch (e) {
            this._logger.error('Exception when deleting tag:', e);
            return false;
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Map a `Tag` to a `TagInfoDto`
     *
     * @param tag
     */
    private _mapTagInfo(tag: Tag): TagInfoDto {
        return {
            id: tag.tagId,
            name: tag.name ?? '',
        };
    }
}
