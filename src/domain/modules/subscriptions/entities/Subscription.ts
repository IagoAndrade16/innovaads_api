import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: null })
  subscriptionId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  packageId: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: false, nullable: false })
  deleted: boolean;

  @Column({ type: 'datetime', nullable: true, default: null })
  deletedAt: Date | null;
}