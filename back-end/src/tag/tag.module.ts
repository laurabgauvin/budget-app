import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { TransactionTag } from './entities/transaction-tag.entity';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
    imports: [TypeOrmModule.forFeature([Tag, TransactionTag])],
    controllers: [TagController],
    providers: [TagService],
    exports: [TagService],
})
export class TagModule {}
