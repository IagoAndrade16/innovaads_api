import { DateUtils } from "../../../../../core/DateUtils";
import { FacebookCredential } from "../../../../../domain/modules/users/entities/FacebookCredential";
import { FacebookCredentialsRepository } from "../../../../../domain/modules/users/repositories/FacebookCredetialsRepository";
import { SaveFacebookCredentialInput } from "../../../../../domain/modules/users/repositories/types/FacebookCredentialsRepositoryTypes";
import { Database } from "../../../Database";

export class FacebookCredentialsRepositoryTypeOrm implements FacebookCredentialsRepository {
  private repository = Database.source.getRepository(FacebookCredential);

  async save(newCredentials: SaveFacebookCredentialInput): Promise<FacebookCredential> {
    const existentAccount = await this.findNotDeletedByUserId(newCredentials.userId);
    if (existentAccount) {
      return await this.repository.save({
        ...existentAccount,
        ...newCredentials,
      });
    }

    return await this.repository.save(newCredentials);
  }

  async findNotDeletedByUserId(userId: string): Promise<FacebookCredential | null> {
    return this.repository.findOne({ 
      where: {
        userId,
        deleted: false
      }
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.repository.update({ userId }, { deleted: true, deletedAt: DateUtils.getNowByTimezone() });
  }
}