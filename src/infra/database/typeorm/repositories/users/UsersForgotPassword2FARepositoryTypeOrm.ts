import { UserForgotPassword2FA } from "../../../../../domain/modules/users/entities/UserForgotPassword2FA";
import { InsertUsersForgotPassword2FAInput, UpdateUsersForgotPassword2FAInput, UsersForgotPassword2FARepository } from "../../../../../domain/modules/users/repositories/UsersForgotPassword2FARepository";
import { Database } from "../../../Database";


export class UsersForgotPassword2FARepositoryTypeOrm implements UsersForgotPassword2FARepository {
  private repository = Database.source.getRepository(UserForgotPassword2FA);

  async insert(input: InsertUsersForgotPassword2FAInput): Promise<void> {
    const userForgotPassword2FA = this.repository.create(input);

    await this.repository.save(userForgotPassword2FA);
  }

  async updateById(id: string, input: UpdateUsersForgotPassword2FAInput): Promise<void> {
    await this.repository.update(id, input);
  }

  async findByEmail(email: string): Promise<UserForgotPassword2FA | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findLastByEmail(email: string): Promise<UserForgotPassword2FA | null> {
    return this.repository.findOne({ where: { email }, order: { createdAt: 'DESC' } });
  }
}