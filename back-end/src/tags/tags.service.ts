import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../transactions/entities/transaction.entity';
import { Tag } from './entities/tag.entity';
import { TransactionTag } from './entities/transaction-tag.entity';

@Injectable()
export class TagsService {
    private readonly logger = new Logger(TagsService.name);

    constructor(
        @InjectRepository(Tag)
        private _tagRepository: Repository<Tag>,
        @InjectRepository(TransactionTag)
        private _transactionTagRepository: Repository<TransactionTag>
    ) {}

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
}
