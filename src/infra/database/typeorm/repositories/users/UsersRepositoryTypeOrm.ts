
import { UniqueEntityID } from "../../../../../domain/entities/UniqueEntityID";
import { User } from "../../../../../domain/modules/users/entities/User";
import { InsertUserDTO, UpdateUserDTO, UsersRepository } from "../../../../../domain/modules/users/repositories/UsersRepository";
import { Database } from "../../../Database";



export class UsersRepositoryTypeOrm implements UsersRepository {
  private repository = Database.source.getRepository(User);

  async insert(data: InsertUserDTO): Promise<User> {
    const user = this.repository.create({
      ...data,
      id: new UniqueEntityID(),
    });

    await this.repository.save(user);

    return user;
  }

  async findById(id: UniqueEntityID): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  async updateById(id: UniqueEntityID, data: UpdateUserDTO): Promise<void> {
    await this.repository.update({ id }, data);
  }
}