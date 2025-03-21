import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserNotification } from "../../users/entities/UserNotification";

export enum NotificationContext {
  GENERICAL = 'generical',
  FACEBOOK_NOT_CONNECTED = 'facebook_not_connected',
  FACEBOOK_EXPIRED = 'facebook_expired',
  GOOGLE_EXPIRED = 'google_expired',
  GOOGLE_NOT_CONNECTED = 'google_not_connected',
}

export type VerifyNotificationOutput = Pick<Notification, 'context' | 'description' | 'id' | 'title'> & {
  alreadyRead: boolean;
};

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: null })
  context: NotificationContext;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  description: string;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;

  @Column({ type: 'timestamp', default: null, nullable: true })
  deletedAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  title: string;

  @OneToMany(() => UserNotification, (userNotification) => userNotification.notification)
  userNotifications: UserNotification[];
}