import { User } from "../entities/User";

export type UsersRepository = {
  insert(data: InsertUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}

export type InsertUserDTO = {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export const usersRepositoryAlias = 'UsersRepository' as const;