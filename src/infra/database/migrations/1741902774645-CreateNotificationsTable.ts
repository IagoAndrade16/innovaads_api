import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class CreateNotificationsTable1741902774645 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'notifications',
                columns: [
                    new TableColumn({
                        name: 'id',
                        type: 'varchar',
                        length: '100',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                    }),
                    new TableColumn({
                        name: 'context',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                        default: null
                    }),
                    new TableColumn({
                        name: 'description',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                        default: null
                    }),
                    new TableColumn({
                        name: 'deleted',
                        type: 'boolean',
                        default: false
                    }),
                    new TableColumn({
                        name: 'deletedAt',
                        type: 'timestamp',
                        default: null,
                        isNullable: true
                    }),
                    new TableColumn({
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                        isNullable: false
                    }),
                    new TableColumn({
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'now()',
                        isNullable: false,
                        onUpdate: 'now()'
                    })
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('notifications');
    }

}
