import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPackageIdIntoUsersTable1737575505998 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE users ADD COLUMN packageId VARCHAR(100) NULL DEFAULT NULL;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE users DROP COLUMN packageId;`);
    }

}
