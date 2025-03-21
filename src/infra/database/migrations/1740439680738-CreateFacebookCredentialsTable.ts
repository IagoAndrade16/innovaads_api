import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class CreateFacebookCredentialsTable1740439680738 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
                await queryRunner.createTable(
                    new Table({
                        name: 'facebook_credentials',
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
                                name: 'userIdOnFacebook',
                                type: 'varchar',
                                length: '255',
                                isNullable: true
                            }),
                            new TableColumn({
                                name: 'expiresIn',
                                type: 'timestamp',
                                isNullable: true
                            }),
                            new TableColumn({
                                name: 'accessToken',
                                type: 'text',
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
                            new TableColumn({
                                name: 'deleted',
                                type: 'boolean',
                                default: false
                            }),
                            new TableColumn({
                                name: 'deletedAt',
                                type: 'timestamp',
                                isNullable: true,
                                default: null
                            })
                        ]
                    })
                )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('facebook_credentials');
    }

}
