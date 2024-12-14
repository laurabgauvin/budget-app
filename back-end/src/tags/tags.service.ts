import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag)
        private _tagRepository: Repository<Tag>
    ) {}

    /**
     * Get a single tag `Tag`
     *
     * @param id
     */
    async getTag(id: string): Promise<Tag | null> {
        return await this._tagRepository.findOneBy({ tagId: id });
    }
}
