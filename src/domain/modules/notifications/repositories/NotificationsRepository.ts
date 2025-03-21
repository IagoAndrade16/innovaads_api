import { Notification, NotificationContext } from "../entities/Notification";
import { InsertNotificationInput } from "./types/NotificationsTypes";

export type NotificationsRepository = {
  insert(data: InsertNotificationInput): Promise<void>;
  findById(id: string): Promise<Notification | null>;
  findByContext(context: NotificationContext): Promise<Notification | null>;
  deleteById(id: string): Promise<void>;
  findManyByIds(ids: string[]): Promise<Notification[]>;
}


export const notificationsRepositoryAlias = 'NotificationsRepository';