import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../transactions/entities/transaction.entity';
import { Tag } from './entities/tag.entity';
import { TransactionTag } from './entities/transaction-tag.entity';

@Injectable()
export class TagsService {
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
        return await this._tagRepository.findOneBy({ tagId: id });
    }

    /**
     * Assign the passed tags to the transaction
     *
     * @param tags
     * @param transaction
     */
    async setTransactionTags(
        tags: string[] | undefined,
        transaction: Transaction
    ): Promise<TransactionTag[]> {
        const transactionTags: TransactionTag[] = [];
        if (tags) {
            try {
                for (const t of tags) {
                    const tag = await this.getTag(t);
                    if (tag) {
                        const tranTag = new TransactionTag();
                        tranTag.transaction = transaction;
                        tranTag.tag = tag;
                        transactionTags.push(tranTag);
                    }
                }
                return await this._transactionTagRepository.save(transactionTags);
            } catch {
                return [];
            }
        }
        return [];
    }
}
