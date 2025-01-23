import { User } from "../entities/User";

export type UsersRepository = {
  insert(data: InsertUserDTO): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  updateById(id: string, data: UpdateUserDTO): Promise<void>;
}

export type InsertUserDTO = {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export type UpdateUserDTO = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export const usersRepositoryAlias = 'UsersRepository' as const;