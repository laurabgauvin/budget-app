import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../transaction/entities/transaction.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagInfoDto } from './dto/tag-info.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { TransactionTag } from './entities/transaction-tag.entity';

@Injectable()
export class TagService {
    private readonly logger = new Logger(TagService.name);

    constructor(
        @InjectRepository(Tag)
        private _tagRepository: Repository<Tag>,
        @InjectRepository(TransactionTag)
        private _transactionTagRepository: Repository<TransactionTag>
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
            this.logger.error('Exception when getting all tags:', e);
            return [];
        }
    }

    /**
     * Get a single tag `Tag`
     *
     * @param id
     */
    async getTag(id: string): Promise<Tag | null> {
        try {
            return await this._tagRepository.findOneBy({ tagId: id });
        } catch (e) {
            this.logger.error('Exception when getting tag:', e);
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
            const tag = new Tag();
            tag.name = createTagDto.name;

            const db = await this._tagRepository.save(tag);
            return db.tagId;
        } catch (e) {
            this.logger.error('Exception when creating tag:', e);
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
            const tag = await this.getTag(updateTagDto.tagId);
            if (tag) {
                tag.name = updateTagDto.name;

                await this._tagRepository.save(tag);
                return true;
            }
            return false;
        } catch (e) {
            this.logger.error('Exception when updating tag:', e);
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
            const tag = await this.getTag(tagId);
            if (!tag) return true;

            await this._tagRepository.remove(tag);
            return true;
        } catch (e) {
            this.logger.error('Exception when deleting tag:', e);
            return false;
        }
    }

    /**
     * Create new `TransactionTag` relations for the passed tags and transaction
     *
     * @param tagIds
     * @param transaction
     */
    async createTransactionTags(
        tagIds: string[] | undefined,
        transaction: Transaction
    ): Promise<TransactionTag[]> {
        try {
            if (tagIds) {
                const transactionTags: TransactionTag[] = [];
                for (const t of tagIds) {
                    const tag = await this.getTag(t);
                    if (tag) {
                        const tranTag = new TransactionTag();
                        tranTag.transaction = transaction;
                        tranTag.tag = tag;
                        transactionTags.push(tranTag);
                    }
                }
                return await this._transactionTagRepository.save(transactionTags);
            }
            return [];
        } catch (e) {
            this.logger.error('Exception when creating transaction tags:', e);
            return [];
        }
    }

    /**
     * Update `TransactionTag` relations to set the passed tags on the transaction
     *
     * @param tagIds
     * @param transaction
     */
    async updateTransactionTags(
        tagIds: string[] | undefined,
        transaction: Transaction
    ): Promise<TransactionTag[]> {
        try {
            const existingTransactionTags = await this._transactionTagRepository.find({
                where: {
                    transaction: {
                        transactionId: transaction.transactionId,
                    },
                },
                relations: ['tag'],
            });

            if (tagIds && tagIds.length > 0) {
                let update = false;

                // Delete removed tags
                const removedTags = existingTransactionTags.filter(
                    (tt) => !tagIds.includes(tt.tag.tagId)
                );
                if (removedTags.length > 0) {
                    await this._transactionTagRepository.remove(removedTags);
                    update = true;
                }

                // Add new tags
                const newTagIds = tagIds.filter(
                    (t) => !existingTransactionTags.map((tt) => tt.tag.tagId).includes(t)
                );
                if (newTagIds.length > 0) {
                    await this.createTransactionTags(newTagIds, transaction);
                    update = true;
                }

                if (!update) return existingTransactionTags;

                return await this._transactionTagRepository.findBy({
                    transaction: {
                        transactionId: transaction.transactionId,
                    },
                });
            } else {
                // Delete all tags
                if (existingTransactionTags.length > 0) {
                    await this._transactionTagRepository.remove(existingTransactionTags);
                }
                return [];
            }
        } catch (e) {
            this.logger.error('Exception when updating transaction tags:', e);
            return [];
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
