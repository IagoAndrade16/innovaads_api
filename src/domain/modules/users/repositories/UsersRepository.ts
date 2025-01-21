import { UniqueEntityID } from "../../../entities/UniqueEntityID";
import { User } from "../entities/User";

export type UsersRepository = {
  insert(data: InsertUserDTO): Promise<User>;
  findById(id: UniqueEntityID): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  updateById(id: UniqueEntityID, data: UpdateUserDTO): Promise<void>;
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
}

export const usersRepositoryAlias = 'UsersRepository' as const;