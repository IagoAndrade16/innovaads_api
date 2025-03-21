import { Database } from "../../../Database";
import { Notification, NotificationContext } from "../../../../../domain/modules/notifications/entities/Notification";
import { NotificationsRepository } from "../../../../../domain/modules/notifications/repositories/NotificationsRepository";
import { InsertNotificationInput } from "../../../../../domain/modules/notifications/repositories/types/NotificationsTypes";
import { In } from "typeorm";


export class NotificationsRepositoryTypeOrm implements NotificationsRepository {
  private repository = Database.source.getRepository(Notification);

  async insert(data: InsertNotificationInput): Promise<void> {
    await this.repository.insert({
      ...data
    });
  }

  async findById(id: string): Promise<Notification | null> {
    return this.repository.findOneBy({ id });
  }

  async findByContext(context: NotificationContext): Promise<Notification | null> {
    return this.repository.findOneBy({ context });
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findManyByIds(ids: string[]): Promise<Notification[]> {
    return this.repository.find({
      where: {
        id: In(ids),
        deleted: false,
      }
    })
  }
}