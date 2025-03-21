import { UserNotification } from "../../../../../domain/modules/users/entities/UserNotification";
import { InsertUserNotificationInput, UpdateUserNotificationInput, UsersNotificationsRepository } from "../../../../../domain/modules/users/repositories/UsersNotificationsRepository";
import { Database } from "../../../Database";



export class UsersNotificationsRepositoryTypeOrm implements UsersNotificationsRepository {
  private repository = Database.source.getRepository(UserNotification);

  async insert(data: InsertUserNotificationInput): Promise<void> {
    const userNotification = this.repository.create({
      ...data,
    });

    await this.repository.save(userNotification);
  }

  async updateById(id: string, data: UpdateUserNotificationInput): Promise<void> {
    await this.repository.update(id, {
      ...data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}