import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddVerified2FaInUsersTable1738275621900 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users', 
            new TableColumn({
                name: 'verified2fa',
                type: 'boolean',
                default: false,
                isNullable: false,
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'verified2fa');
    }

}
