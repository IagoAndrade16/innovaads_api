import { DateUtils } from "../../../../../core/DateUtils";
import { GoogleCredential } from "../../../../../domain/modules/users/entities/GoogleCredential";
import { GoogleCredentialsRepository } from "../../../../../domain/modules/users/repositories/GoogleCredentialsRepository";
import { InsertGoogleCrentialInput } from "../../../../../domain/modules/users/repositories/types/GoogleCredentialsRepositoryTypes";
import { Database } from "../../../Database";


export class GoogleCredentialsRepositoryTypeOrm implements GoogleCredentialsRepository {
  private repository = Database.source.getRepository(GoogleCredential);

  async insert(data: InsertGoogleCrentialInput): Promise<GoogleCredential> {
    const googleCredential = this.repository.create(data);

    await this.repository.save(googleCredential);

    return googleCredential;
  }

  async findNotDeletedByUserId(userId: string): Promise<GoogleCredential | null> {
    return this.repository.findOne({
      where: {
        userId,
        deleted: false,
      },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.repository.update({ userId, deleted: false }, {
      deleted: true, 
      deletedAt: DateUtils.getNowByTimezone(),
      accessToken: null,
      refreshToken: null,
      expiresIn: null,
      expiresRefreshIn: null,
    })
  }
}