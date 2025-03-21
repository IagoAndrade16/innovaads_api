import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class CreateUsesNotificationTable1742033825843 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users_notifications',
                columns: [
                    new TableColumn({
                        name: 'id',
                        type: 'varchar',
                        length: '100',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                    }),
                    new TableColumn({
                        name: 'userId',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: 'notificationId',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: 'alreadyRead',
                        type: 'boolean',
                        default: false
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
        await queryRunner.dropTable('users_notifications');
    }

}
