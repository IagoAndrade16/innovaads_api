import { Database } from "../../../../database/Database";
import { User2FA } from "../../entities/User2FA";
import { InsertUsers2FADTO, UpdateUsers2FADTO, Users2FARepository } from "../Users2FARepository";



export class Users2FARepositoryTypeOrm implements Users2FARepository {
  private repository = Database.source.getRepository(User2FA);

  async insert(data: InsertUsers2FADTO): Promise<void> {
    await this.repository.insert(data);
  }

  async findLastCodeByUserId(userId: string): Promise<User2FA | null> {
    return await this.repository.findOne({ 
      where: { userId },
      order: {
        createdAt: 'DESC',
      }
    });
  }

  async updateById(id: string, data: UpdateUsers2FADTO): Promise<void> {
    await this.repository.update(id, data);
  }
}