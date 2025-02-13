import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class CreateSubscriptionsTable1738442444639 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
                    new Table({
                        name: 'subscriptions',
                        columns: [
                            new TableColumn({
                                name: 'id',
                                type: 'int',
                                isPrimary: true,
                                isGenerated: true,
                                generationStrategy: 'increment',
                            }),
                            new TableColumn({
                                name: 'subscriptionId',
                                type: 'varchar',
                                length: '100',
                                isNullable: false
                            }),
                            new TableColumn({
                                name: 'userId',
                                type: 'varchar',
                                length: '255',
                                isNullable: false
                            }),
                            new TableColumn({
                                name: 'packageId',
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
                            }),
                            new TableColumn({
                                name: 'deleted',
                                type: 'boolean',
                                isNullable: false,
                                default: false
                            }),
                            new TableColumn({
                                name: 'deletedAt',
                                type: 'datetime',
                                isNullable: true,
                                default: null
                            }),
                        ]
                    })
                )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('subscriptions');
    }

}
