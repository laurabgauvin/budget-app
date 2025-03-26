import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { Tag } from './entities/tag.entity';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
    imports: [TypeOrmModule.forFeature([Tag]), DatabaseModule],
    controllers: [TagController],
    providers: [TagService],
    exports: [TagService],
})
export class TagModule {}
