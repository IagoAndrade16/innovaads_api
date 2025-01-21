import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PackageDetails } from "./PackageDetails";

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  description: string;

  @Column({ 
    type: 'decimal', 
    scale: 2, 
    precision: 10, 
    nullable: false, 
    transformer: {
      to: (value: number) => value,  
      from: (value: string) => parseFloat(value),  
    },
  })
  price: number;

  @Column({ type: 'boolean', default: false, nullable: false })
  deleted: boolean;

  @Column({ type: 'timestamp', nullable: true, default: null})
  deletedAt: Date | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => PackageDetails, packageDetails => packageDetails.package, {
    cascade: true
  })
  details: PackageDetails[];
}