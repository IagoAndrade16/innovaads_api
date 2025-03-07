import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { DateUtils } from "../../../../core/DateUtils";

@Entity('google_credentials')
export class GoogleCredential {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  userId: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresIn: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  expiresRefreshIn: Date | null;

  @Column({ type: 'text' })
  accessToken: string | null;

  @Column({ type: 'text' })
  refreshToken: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;

  @Column({ type: 'timestamp', nullable: true, default: null })
  deletedAt: Date | null;

  @ManyToOne(() => User, user => user.googleCredentials)
  user: User;

  static generateExpirationDate(expiresIn: number): Date {
    return DateUtils.addSecondsToDate(new Date(), expiresIn);
  }
}