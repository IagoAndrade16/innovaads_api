
import { User } from "../../../../../domain/modules/users/entities/User";
import { InsertUserDTO, UpdateUserDTO, UsersRepository } from "../../../../../domain/modules/users/repositories/UsersRepository";
import { Database } from "../../../Database";

export class UsersRepositoryTypeOrm implements UsersRepository {
  private repository = Database.source.getRepository(User);

  async insert(data: InsertUserDTO): Promise<User> {
    const user = this.repository.create({
      ...data,
    });

    await this.repository.save(user);

    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ 
      where: { id },
      relations: { googleCredentials: true, facebookCredentials: true },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: {
        email,
      },
      relations: { facebookCredentials: true },
    });
  }

  async updateById(id: string, data: UpdateUserDTO): Promise<void> {
    await this.repository.update({ id }, data);
  }
}