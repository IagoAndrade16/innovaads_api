 
import { inject, singleton } from "tsyringe";
import { UseCase } from "../../../../core/UseCase";
import { UsersRepository, usersRepositoryAlias } from "../../users/repositories/UsersRepository";
import { NotificationsRepository, notificationsRepositoryAlias } from "../repositories/NotificationsRepository";
import { UserNotFoundError } from "../../../errors/UserNotFoundError";
import { GoogleCredential } from "../../users/entities/GoogleCredential";
import { VerifyNotificationOutput } from "../entities/Notification";


export type FetchNotificationsUseCaseInput = {
  userId: string;
}

export type FetchNotificationsUseCaseOutput = {
  notificationsToSend: VerifyNotificationOutput[],
  notificationsAlreadyRead: VerifyNotificationOutput[],
}


@singleton()
export class FetchNotificationsUseCase implements UseCase<FetchNotificationsUseCaseInput, FetchNotificationsUseCaseOutput> {
  constructor (
    @inject(usersRepositoryAlias)
    private readonly usersRepository: UsersRepository,

    @inject(notificationsRepositoryAlias)
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute(input: FetchNotificationsUseCaseInput): Promise<FetchNotificationsUseCaseOutput> {
    const user = await this.usersRepository.findById(input.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const userNotificationsAlreadyRead = user.latestUserNotificationsRead;    
    
    const googleCredentials = user.googleCredential;
    const googleNotifications = await GoogleCredential.verifyGoogleNotifications(googleCredentials, userNotificationsAlreadyRead);

    const notificationsAlreadyRead = await this.notificationsRepository.findManyByIds(userNotificationsAlreadyRead.map(notification => notification.notificationId));
    const notificationsAlreadyReadFormatted = userNotificationsAlreadyRead.map(userNotification => {
      const notificationFound = notificationsAlreadyRead.find(notificationAlreadyRead => notificationAlreadyRead.id === userNotification.notificationId);

      return {
        alreadyRead: userNotification.alreadyRead,
        title: notificationFound!.title,
        context: notificationFound!.context,
        description: notificationFound!.description,
        id: notificationFound!.id,
      }
    });

    const notificationsToSend = [...googleNotifications];

    const remainingAlreadyReadNotifications = notificationsAlreadyReadFormatted.filter(notification => {
      return !notificationsToSend.some(notificationToSend => notificationToSend.id === notification.id);
    });
    return {
      notificationsAlreadyRead: remainingAlreadyReadNotifications,
      notificationsToSend: notificationsToSend,
    }
  }
}