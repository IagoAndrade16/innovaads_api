import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class CreateUsers2FATable1734559531192 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users_auth_2fa',
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
                        name: 'email',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: 'code',
                        type: 'varchar',
                        length: '20',
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: 'alreadyUsed',
                        type: 'boolean',
                        isNullable: false,
                        default: false,
                    }),
                    new TableColumn({
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()'
                    }),
                    new TableColumn({
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'now()',
                        onUpdate: 'now()'
                    })
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users_auth_2fa');
    }

}
