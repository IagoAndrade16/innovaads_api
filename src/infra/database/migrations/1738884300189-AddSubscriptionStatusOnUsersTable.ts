
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubscriptionStatusOnUsersTable1738884300189 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE users ADD COLUMN subscriptionStatus VARCHAR(255) NULL DEFAULT NULL;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN subscriptionStatis;`);
    }

}
