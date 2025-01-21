import { UniqueEntityID } from "../../../entities/UniqueEntityID";
import { User2FA } from "../entities/User2FA";

export type Users2FARepository = {
  insert(data: InsertUsers2FADTO): Promise<User2FA>;
  findLastCodeByUserId(userId: UniqueEntityID): Promise<User2FA | null>;
  updateById(id: UniqueEntityID, data: UpdateUsers2FADTO): Promise<void>;
}

export type InsertUsers2FADTO = {
  userId: UniqueEntityID;
  email: string;
  code: string;
}

export type UpdateUsers2FADTO = {
  code?: string;
  alreadyUsed?: boolean;
}

export const users2FARepositoryAlias = 'Users2FARepository' as const;;