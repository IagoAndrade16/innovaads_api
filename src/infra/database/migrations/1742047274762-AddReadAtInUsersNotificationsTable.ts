import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReadAtInUsersNotificationsTable1742047274762 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE users_notifications
            ADD COLUMN readAt TIMESTAMP NULL DEFAULT NULL AFTER alreadyRead;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE users_notifications
            DROP COLUMN readAt;
        `);
    }

}
