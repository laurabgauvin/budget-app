import { Injectable, Logger } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class DatabaseService {
    private readonly _logger = new Logger(DatabaseService.name);

    constructor(private readonly _dataSource: DataSource) {}

    /**
     * Create or update a database record
     *
     * @param entity
     * @param queryRunner
     */
    async save<T>(entity: T, queryRunner?: QueryRunner): Promise<T | null> {
        try {
            if (queryRunner) {
                return await queryRunner.manager.save(entity);
            }
            return await this._dataSource.manager.save(entity);
        } catch (e) {
            this._logger.error('Exception when creating entity:', e);
            return null;
        }
    }

    /**
     * Soft remove a database record
     *
     * @param entity
     * @param queryRunner
     */
    async softRemove<T>(entity: T, queryRunner?: QueryRunner): Promise<T | null> {
        try {
            if (queryRunner) {
                return await queryRunner.manager.softRemove(entity);
            }
            return await this._dataSource.manager.softRemove(entity);
        } catch (e) {
            this._logger.error('Exception when soft deleting entity:', e);
            return null;
        }
    }
}
