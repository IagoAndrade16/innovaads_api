import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddSubscriptionIdIntoUsersTable1738442251391 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users', 
            new TableColumn({
                name: 'subscriptionId',
                type: 'varchar',
                default: null,
                isNullable: true,
                length: '100',
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "subscriptionId"`);
    }

}
