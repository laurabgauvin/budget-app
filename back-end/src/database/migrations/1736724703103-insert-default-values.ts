import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertDefaultValues1736724703103 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `WITH existing_payee_check AS (
                SELECT COUNT(*) AS payee_count
                FROM "payee"
                WHERE "name" = 'Starting Balance'
                OR "type" = 'starting-balance'
            ),
            existing_category_check AS (
                SELECT COUNT(*) AS category_count
                FROM "category"
                WHERE "name" = 'Income'
            ),
            new_category AS (
                INSERT INTO "category" ("name", "is_editable")
                SELECT 'Income', false
                WHERE (SELECT category_count FROM existing_category_check) = 0
                RETURNING "category_id"
            )
            INSERT INTO "payee" ("name", "type", "category_id")
            SELECT 'Starting Balance', 'starting-balance', category_id
            FROM new_category
            WHERE (SELECT payee_count FROM existing_payee_check) = 0;
            `
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM "payee" WHERE "name" = 'Starting Balance';
             DELETE FROM "category" WHERE "name" = 'Income';`
        );
    }
}
