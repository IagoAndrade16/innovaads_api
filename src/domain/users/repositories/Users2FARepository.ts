import { User2FA } from "../entities/User2FA";

export type Users2FARepository = {
  insert(data: InsertUsers2FADTO): Promise<void>;
  findLastCodeByUserId(userId: string): Promise<User2FA | null>;
  updateById(id: string, data: UpdateUsers2FADTO): Promise<void>;
}

export type InsertUsers2FADTO = {
  userId: string;
  email: string;
  code: string;
}

export type UpdateUsers2FADTO = {
  code?: string;
  alreadyUsed?: boolean;
}

export const users2FARepositoryAlias = 'Users2FARepository' as const;;