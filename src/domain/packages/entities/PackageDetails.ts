import { Column, Entity, PrimaryColumn } from "typeorm";



@Entity('package_details')
export class PackageDetails {
  @PrimaryColumn({ type: 'uuid', length: 100 })
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  description: string;

  @Column({ type: 'uuid', length: 100, nullable: false })
  packageId: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  deleted: boolean;

  @Column({ type: 'timestamp', nullable: true, default: null})
  deletedAt: Date | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}