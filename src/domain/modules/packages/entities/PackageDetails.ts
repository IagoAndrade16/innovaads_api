import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Package } from "./Package";

@Entity('package_details')
export class PackageDetails {
  @PrimaryGeneratedColumn('uuid')

  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  description: string;

  @Column({ 
    type: 'varchar', 
    length: 100, 
    nullable: false,
  })
  packageId: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  deleted: boolean;

  @Column({ type: 'timestamp', nullable: true, default: null})
  deletedAt: Date | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Package, (packageEntity) => packageEntity.details, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  package: Package;
}