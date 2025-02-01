import { UserForgotPassword2FA } from "../entities/UserForgotPassword2FA";

export type UsersForgotPassword2FARepository = {
  insert(input: InsertUsersForgotPassword2FAInput): Promise<void>;
  updateById(id: string, input: UpdateUsersForgotPassword2FAInput): Promise<void>;
  findByEmail(email: string): Promise<UserForgotPassword2FA | null>;
  findLastByEmail(email: string): Promise<UserForgotPassword2FA | null>;
}

export type InsertUsersForgotPassword2FAInput = {
  email: string;
  code: string;
  userId: string;
}

export type UpdateUsersForgotPassword2FAInput = {
  code?: string;
  alreadyUsed?: boolean;
}

export const usersForgotPassword2FARepositoryAlias = 'UserForgotPassword2FARepository';