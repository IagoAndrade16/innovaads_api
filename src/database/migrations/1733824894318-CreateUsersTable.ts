import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class CreateUsersTable1733824894318 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    new TableColumn({
                        name: 'id',
                        type: 'varchar',
                        length: '100',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                    }),
                    new TableColumn({
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                        isNullable: false
                    }),
                    new TableColumn({
                        name: 'password',
                        type: 'varchar',
                        length: '255',
                        isNullable: false
                    }),
                    new TableColumn({
                        name: 'email',
                        type: 'varchar',
                        length: '255',
                        isNullable: false
                    }),
                    new TableColumn({
                        name: 'phone',
                        type: 'varchar',
                        length: '255',
                        isNullable: false
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
        await queryRunner.dropTable('users');
    }

}