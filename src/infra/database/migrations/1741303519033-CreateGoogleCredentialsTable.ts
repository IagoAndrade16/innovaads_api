import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class CreateGoogleCredentialsTable1741303519033 implements MigrationInterface {


    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'google_credentials',
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
                        isNullable: false
                    }),
                    new TableColumn({
                        name: 'accessToken',
                        type: 'text',
                        default: null,
                        isNullable: true
                    }),
                    new TableColumn({
                        name: 'refreshToken',
                        type: 'text',
                        default: null,
                        isNullable: true
                    }),
                    new TableColumn({
                        name: 'expiresIn',
                        type: 'timestamp',
                        default: null,
                        isNullable: true
                    }),
                    new TableColumn({
                        name: 'expiresRefreshIn',
                        type: 'timestamp',
                        default: null,
                        isNullable: true
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
                        default: 'now()'
                    }),
                    new TableColumn({
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'now()',
                        onUpdate: 'now()'
                    }),
                ]
            })
        )
    }


    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('google_credentials');
    }

}
