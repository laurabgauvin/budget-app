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
    async save<Entity>(entity: Entity, queryRunner?: QueryRunner): Promise<Entity | null> {
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
     * Remove a database record
     *
     * @param entity
     * @param queryRunner
     */
    async remove<Entity>(entity: Entity, queryRunner?: QueryRunner): Promise<Entity | null> {
        try {
            if (queryRunner) {
                return await queryRunner.manager.remove(entity);
            }
            return await this._dataSource.manager.remove(entity);
        } catch (e) {
            this._logger.error('Exception when removing entity:', e);
            return null;
        }
    }

    /**
     * Soft remove a database record
     *
     * @param entity
     * @param queryRunner
     */
    async softRemove<Entity>(entity: Entity, queryRunner?: QueryRunner): Promise<Entity | null> {
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
