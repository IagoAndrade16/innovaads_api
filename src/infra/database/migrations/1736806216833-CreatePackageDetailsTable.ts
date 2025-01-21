import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class CreatePackageDetailsTable1736806216833 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'package_details',
                columns: [
                    new TableColumn({
                        name: 'id',
                        type: 'varchar',
                        length: '100',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                    }),
                    new TableColumn({
                        name: 'description',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: 'packageId',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: 'deleted',
                        type: 'boolean',
                        isNullable: false,
                        default: false,
                    }),
                    new TableColumn({
                        name: 'deletedAt',
                        type: 'timestamp',
                        isNullable: true,
                        default: null,
                    }),
                    new TableColumn({
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'now()',
                        onUpdate: 'now()',
                        isNullable: false,
                    })
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('package_details')
    }

}
