import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DatabaseService } from '../database/database.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagInfoDto } from './dto/tag-info.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
    private readonly _logger = new Logger(TagService.name);

    constructor(
        @InjectRepository(Tag)
        private readonly _tagRepository: Repository<Tag>,
        private readonly _databaseService: DatabaseService
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

            this._logger.log('No tags found');
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
     * Get a `Tag` by name
     *
     * @param name
     */
    async getTagByName(name: string): Promise<Tag | null> {
        try {
            return await this._tagRepository.findOneBy({ name: name });
        } catch (e) {
            this._logger.error('Exception when getting tag:', e);
            return null;
        }
    }

    /**
     * Create a new tag
     *
     * @param createTagDto
     */
    async createTag(createTagDto: CreateTagDto): Promise<string | null> {
        try {
            // Check if a tag with that name already exists
            const existingTag = await this.getTagByName(createTagDto.name);
            if (existingTag) {
                this._logger.error(`A tag with this name: '${createTagDto.name}' already exists`);
                return null;
            }

            const tag = new Tag();
            tag.name = createTagDto.name;
            tag.color = createTagDto.color;
            tag.show = createTagDto.show;

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
            // Check if a tag with that name already exists
            const existingTag = await this.getTagByName(updateTagDto.name);
            if (existingTag) {
                this._logger.error(`A tag with this name: '${updateTagDto.name}' already exists`);
                return false;
            }

            const tag = await this.getTagById(updateTagDto.tagId);
            if (tag) {
                if (!tag.isEditable) {
                    this._logger.error(`The tag: '${updateTagDto.name}' may not be edited`);
                    return false;
                }

                tag.name = updateTagDto.name;
                tag.show = updateTagDto.show;
                tag.color = updateTagDto.color;

                await this._databaseService.save(tag);
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
            if (!tag) {
                this._logger.log(`Could not find tag '${tagId}' to delete`);
                return true;
            }

            if (!tag.isEditable) {
                this._logger.error(`The tag: '${tag.name}' may not be deleted`);
                return false;
            }

            await this._databaseService.remove(tag);
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
            show: tag.show,
            color: tag.color ?? '',
            isEditable: tag.isEditable,
        };
    }
}
