import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { DateUtils } from "../../../../core/DateUtils";

@Entity('facebook_credentials')
export class FacebookCredential {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  userIdOnFacebook: string;

  @Column({ type: 'timestamp', nullable: false })
  expiresIn: Date;

  @Column({ type: 'text' })
  accessToken: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;

  @Column({ type: 'timestamp', nullable: true, default: null })
  deletedAt: Date | null;

  @ManyToOne(() => User, user => user.facebookCredentials)
  user: User;

  static generateExpirationDate(expiresIn: number): Date {
    return DateUtils.addSecondsToDate(new Date(), expiresIn);
  }
}