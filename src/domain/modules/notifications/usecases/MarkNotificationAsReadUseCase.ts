import { inject, singleton } from "tsyringe";
import { UseCase } from "../../../../core/UseCase";
import { UsersRepository, usersRepositoryAlias } from "../../users/repositories/UsersRepository";
import { UsersNotificationsRepository, usersNotificationsRepositoryAlias } from "../../users/repositories/UsersNotificationsRepository";
import { UserNotFoundError } from "../../../errors/UserNotFoundError";
import { DomainError } from "../../../errors/DomainError";
import { NotificationsRepository, notificationsRepositoryAlias } from "../repositories/NotificationsRepository";


export type MarkNotificationAsReadInput = {
  userId: string;
  notificationId: string;
}

@singleton()
export class MarkNotificationAsReadUseCase implements UseCase<MarkNotificationAsReadInput, void> {
  constructor (
    @inject(usersRepositoryAlias)
    private readonly usersRepository: UsersRepository,

    @inject(notificationsRepositoryAlias)
    private readonly notificationsRepository: NotificationsRepository,

    @inject(usersNotificationsRepositoryAlias)
    private readonly usersNotificationsRepository: UsersNotificationsRepository,
  ) {}

  async execute(input: MarkNotificationAsReadInput): Promise<void> {
    const user = await this.usersRepository.findById(input.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const notification = await this.notificationsRepository.findById(input.notificationId);

    if (!notification) {
      throw new DomainError(400, 'NOTIFICATION_NOT_FOUND');
    }

    await this.usersNotificationsRepository.insert({
      alreadyRead: true,
      notificationId: input.notificationId,
      userId: input.userId,
      readAt: new Date(),
    })
  }
}