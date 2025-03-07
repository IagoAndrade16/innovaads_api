import { find } from "../../../../../../core/DependencyInjection";
import { GoogleCredential } from "../../../../../../domain/modules/users/entities/GoogleCredential";
import { GoogleCredentialsRepository, googleCredentialsRepositoryAlias } from "../../../../../../domain/modules/users/repositories/GoogleCredentialsRepository";
import { InsertGoogleCrentialInput } from "../../../../../../domain/modules/users/repositories/types/GoogleCredentialsRepositoryTypes";
import { Database } from "../../../../Database";

const googleCredentialsRepository = find<GoogleCredentialsRepository>(googleCredentialsRepositoryAlias);

const deleteGoogleCredential = async (id: string) => {
  await Database.source.getRepository(GoogleCredential).delete(id);
} 

beforeAll(async () => {
  await Database.initialize();
});

afterAll(async () => {
  await Database.close();
});

const mockGoogleCredential = {
  accessToken: 'mockAccessToken',
  refreshToken: 'mockRefreshToken',
  expiresIn: new Date(),
  expiresRefreshIn: new Date(),
  userId: 'mockUserId',
} as InsertGoogleCrentialInput;

describe('Insert', () => {
  it('should insert a GoogleCredential', async () => {
    const googleCredentialInserted = await googleCredentialsRepository.insert(mockGoogleCredential);

    await deleteGoogleCredential(googleCredentialInserted.id);

    expect(googleCredentialInserted).toBeInstanceOf(GoogleCredential);
    expect(googleCredentialInserted).toHaveProperty('id');
    expect(googleCredentialInserted).toHaveProperty('accessToken', mockGoogleCredential.accessToken);
    expect(googleCredentialInserted).toHaveProperty('refreshToken', mockGoogleCredential.refreshToken);
  }); 
});

describe('findNotDeletedByUserId', () => {
  it('should return null if no GoogleCredential is found', async () => {
    const googleCredentialInserted = await googleCredentialsRepository.insert(mockGoogleCredential);
  
    const googleCredential = await googleCredentialsRepository.findNotDeletedByUserId('nonExistingUserId');

    await deleteGoogleCredential(googleCredentialInserted.id);

    expect(googleCredential).toBeNull();
  });

  it('should return null if GoogleCredential is deleted', async () => {
    const googleCredentialInserted = await googleCredentialsRepository.insert(mockGoogleCredential);
    await Database.source.getRepository(GoogleCredential).update(googleCredentialInserted.id, {
      deleted: true,
      deletedAt: new Date(),
    });

    const googleCredential = await googleCredentialsRepository.findNotDeletedByUserId(mockGoogleCredential.userId);

    await deleteGoogleCredential(googleCredentialInserted.id);

    expect(googleCredential).toBeNull();
  });

  it('should retirn a GoogleCredential by userId if it exists', async () => {
    const googleCredentialInserted = await googleCredentialsRepository.insert(mockGoogleCredential);
    const googleCredentialInserted2 = await googleCredentialsRepository.insert({
      ...mockGoogleCredential,
      userId: 'anotherMockUserId',
    });

    const googleCredential = await googleCredentialsRepository.findNotDeletedByUserId(mockGoogleCredential.userId);

    await deleteGoogleCredential(googleCredentialInserted.id);
    await deleteGoogleCredential(googleCredentialInserted2.id);

    expect(googleCredential).toBeInstanceOf(GoogleCredential);
    expect(googleCredential).toHaveProperty('id');
    expect(googleCredential?.id).toBe(googleCredentialInserted.id);
  });
});

describe('deleteByUserId', () => {
  it('should delete a GoogleCredential by userId', async () => {
    const googleCredentialInserted = await googleCredentialsRepository.insert(mockGoogleCredential);

    await googleCredentialsRepository.deleteByUserId(mockGoogleCredential.userId);

    const googleCredential = await googleCredentialsRepository.findNotDeletedByUserId(mockGoogleCredential.userId);

    await deleteGoogleCredential(googleCredentialInserted.id);
    
    expect(googleCredential).toBeNull();
  });
});