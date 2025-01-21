
import { UniqueEntityID } from "../../../../../domain/entities/UniqueEntityID";
import { User2FA } from "../../../../../domain/modules/users/entities/User2FA";
import { InsertUsers2FADTO, UpdateUsers2FADTO, Users2FARepository } from "../../../../../domain/modules/users/repositories/Users2FARepository";
import { Database } from "../../../Database";




export class Users2FARepositoryTypeOrm implements Users2FARepository {
  private repository = Database.source.getRepository(User2FA);

  async insert(data: InsertUsers2FADTO): Promise<User2FA> {
    const user2FA = this.repository.create({
      ...data,
      id: new UniqueEntityID(),
    });
    await this.repository.insert(user2FA);

    return user2FA;
  }

  async findLastCodeByUserId(userId: UniqueEntityID): Promise<User2FA | null> {
    return await this.repository.findOne({ 
      where: { userId },
      order: {
        createdAt: 'DESC',
      }
    });
  }

  async updateById(id: UniqueEntityID, data: UpdateUsers2FADTO): Promise<void> {
    await this.repository.update({ id }, data);
  }
}