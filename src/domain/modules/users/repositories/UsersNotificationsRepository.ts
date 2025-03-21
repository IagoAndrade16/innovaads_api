export type UsersNotificationsRepository = {
  insert(data: InsertUserNotificationInput): Promise<void>;
  updateById(id: string, data: UpdateUserNotificationInput): Promise<void>;
  delete(id: string): Promise<void>;
}

export type InsertUserNotificationInput = {
  alreadyRead: boolean;
  notificationId: string;
  userId: string;
  readAt: Date;
}

export type UpdateUserNotificationInput = {
  alreadyRead?: boolean;
  notificationId?: string;
  userId?: string;
  readAt?: Date | null;
}

export const usersNotificationsRepositoryAlias = 'UsersNotificationsRepository';