import { Database } from "../../../../database/Database";
import { User } from "../../entities/User";
import { InsertUserDTO, UsersRepository } from "../UsersRepository";


export class UsersRepositoryTypeOrm implements UsersRepository {
  private repository = Database.source.getRepository(User);

  async insert(data: InsertUserDTO): Promise<User> {
    const user = this.repository.create(data);

    await this.repository.save(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }
}