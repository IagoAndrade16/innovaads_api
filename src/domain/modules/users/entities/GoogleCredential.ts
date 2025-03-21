import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { DateUtils } from "../../../../core/DateUtils";
import { NotificationsRepository, notificationsRepositoryAlias } from "../../notifications/repositories/NotificationsRepository";
import { UserNotification } from "./UserNotification";
import { NotificationContext, VerifyNotificationOutput } from "../../notifications/entities/Notification";
import { find } from "../../../../core/DependencyInjection";
import { UsersNotificationsRepository, usersNotificationsRepositoryAlias } from "../repositories/UsersNotificationsRepository";
import moment from "moment";


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

  static async verifyGoogleNotifications(googleCredential: GoogleCredential | null, userNotifications: UserNotification[]): Promise<VerifyNotificationOutput[]> {
    if (!googleCredential) {
      return this.handleGoogleNotConnected(userNotifications);
    }
    
    if (!User.isExpired(googleCredential.expiresRefreshIn!)) {
      return [];
    }

    return this.handleGoogleExpired(userNotifications);
  }

  static async handleGoogleExpired(userNotifications: UserNotification[]): Promise<VerifyNotificationOutput[]> {
    const notificationsRepository = find<NotificationsRepository>(notificationsRepositoryAlias);
    const usersNotificationsRepository = find<UsersNotificationsRepository>(usersNotificationsRepositoryAlias);

    const googleExpiredNotification = await notificationsRepository.findByContext(NotificationContext.GOOGLE_EXPIRED);
    const googleNotificationAlreadyRead = userNotifications.find(notification =>  { 
      return notification.notificationId === googleExpiredNotification!.id
    });

    if (googleNotificationAlreadyRead) await usersNotificationsRepository.delete(googleNotificationAlreadyRead.id);

    return [
      {
        alreadyRead: false,
        title: googleExpiredNotification!.title,
        context: googleExpiredNotification!.context,
        description: googleExpiredNotification!.description,
        id: googleExpiredNotification!.id
      }
    ]
  }

  static async handleGoogleNotConnected(userNotifications: UserNotification[]): Promise<VerifyNotificationOutput[]> {
    const notificationsRepository = find<NotificationsRepository>(notificationsRepositoryAlias);

    const daysToValidateToSendAgain = 5;
    const googleNotConnectedNotification = await notificationsRepository.findByContext(NotificationContext.GOOGLE_NOT_CONNECTED);

    const googleNotificationAlreadyRead = userNotifications.find(notification => {
      return notification.notificationId === googleNotConnectedNotification!.id
    });

    if (!googleNotificationAlreadyRead) return [
      {
        alreadyRead: false,
        title: googleNotConnectedNotification!.title,
        context: googleNotConnectedNotification!.context,
        description: googleNotConnectedNotification!.description,
        id: googleNotConnectedNotification!.id
      }
    ];
    
    const dateToValidateToSendAgain = moment(googleNotificationAlreadyRead.readAt).add(daysToValidateToSendAgain, 'day');
    
    if (moment().isAfter(dateToValidateToSendAgain)) {
      return [
        {
          alreadyRead: false,
          title: googleNotConnectedNotification!.title,
          context: googleNotConnectedNotification!.context,
          description: googleNotConnectedNotification!.description,
          id: googleNotConnectedNotification!.id
        }
      ]
    } else return [];
  }
}