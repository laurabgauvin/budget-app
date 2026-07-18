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
            INSERT INTO "payee" ("name", "type", "is_editable", "category_id")
            SELECT 'Starting Balance', 'starting-balance', false, category_id
            FROM new_category
            WHERE (SELECT payee_count FROM existing_payee_check) = 0;
            `
        );

        await queryRunner.query(
            `INSERT INTO "schedule" ("frequency", "interval", "display_name", "is_editable", "display_order")
            VALUES ('day', 1, 'Daily', false, 1),
                   ('week', 1, 'Weekly', false, 2),
                   ('week', 2, 'Every other week', false, 3),
                   ('week', 4, 'Every 4 weeks', false, 4),
                   ('month', 1, 'Monthly', false, 5),
                   ('month', 2, 'Every other month', false, 6),
                   ('month', 3, 'Every 3 months', false, 7),
                   ('month', 4, 'Every 4 months', false, 8),
                   ('month', 6, 'Twice a year', false, 9),
                   ('year', 1, 'Yearly', false, 10),
                   ('year', 2, 'Every other year', false, 11);
            `
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM "payee" WHERE "name" = 'Starting Balance';
             DELETE FROM "category" WHERE "name" = 'Income';
             DELETE FROM "schedule" WHERE "is_editable" = false;`
        );
    }
}
