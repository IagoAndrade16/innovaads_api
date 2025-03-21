import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTitleInNotificationsTable1742421295047 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('notifications', 
            new TableColumn({
                name: 'title',
                type: 'varchar',
                length: '255',
                isNullable: true,
                default: null,
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('notifications', 'title');
    }

}
