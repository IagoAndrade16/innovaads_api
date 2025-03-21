import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Notification } from "../../notifications/entities/Notification";


@Entity('users_notifications')
export class UserNotification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: null })
  userId: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: null })
  notificationId: string;

  @Column({ type: 'boolean', default: false })
  alreadyRead: boolean;

  @Column({ type: 'timestamp', default: null, nullable: true })
  readAt: Date | null;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;

  @Column({ type: 'timestamp', default: null, nullable: true })
  deletedAt: Date | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.userNotifications, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Notification, (notification) => notification.userNotifications, { onDelete: 'CASCADE' })
  notification: Notification;
}