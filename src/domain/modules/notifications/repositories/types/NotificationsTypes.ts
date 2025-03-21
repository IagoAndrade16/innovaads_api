import { NotificationContext } from "../../entities/Notification"

export type InsertNotificationInput = {
  context: NotificationContext;
  description: string;
}