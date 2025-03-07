import { find } from "../../../../../../core/DependencyInjection";
import { FacebookCredential } from "../../../../../../domain/modules/users/entities/FacebookCredential";
import { FacebookCredentialsRepository, facebookCredentialsRepositoryAlias } from "../../../../../../domain/modules/users/repositories/FacebookCredetialsRepository";

import { Database } from "../../../../Database";


const facebookcredentialsRepository = find<FacebookCredentialsRepository>(facebookCredentialsRepositoryAlias);

beforeAll(async () => {
  await Database.initialize();
});

afterAll(async () => {
  await Database.close();
});

const makeFacebookCredential = () => {
  return {
    accessToken: 'valid_token',
    userId: 'valid_user_id',
    expiresIn: FacebookCredential.generateExpirationDate(3600),
    userIdOnFacebook: 'valid_user_id_on_facebook'
  }
}

describe('save', () => {
  it('should create a creadential', async () => {
    const credential = makeFacebookCredential();

    await Database.source.getRepository(FacebookCredential).delete({ userId: credential.userId });

    const savedCredential = await facebookcredentialsRepository.save(credential);
    
    await Database.source.getRepository(FacebookCredential).delete({ id: savedCredential.id });

    expect(savedCredential).not.toBeNull();
  });

  it('should update a creadential', async () => {
    const credential = makeFacebookCredential();

    await Database.source.getRepository(FacebookCredential).delete({ userId: credential.userId });

    const savedCredential = await facebookcredentialsRepository.save(credential);
    
    const updatedCredential = await facebookcredentialsRepository.save({
      ...savedCredential,
      accessToken: 'new_token',
      expiresIn: FacebookCredential.generateExpirationDate(3600),
      userId: credential.userId,
      userIdOnFacebook: 'valid_user_id_on_facebook'
    });

    await Database.source.getRepository(FacebookCredential).delete({ id: updatedCredential.id });

    expect(updatedCredential.accessToken).toBe('new_token');
  });
});

describe('findNotDeletedByUserId', () => {
  it('should return a credential', async () => {
    const credential = makeFacebookCredential();

    await Database.source.getRepository(FacebookCredential).delete({ userId: credential.userId });

    const savedCredential = await facebookcredentialsRepository.save(credential);
    
    const foundCredential = await facebookcredentialsRepository.findNotDeletedByUserId(savedCredential.userId);

    await Database.source.getRepository(FacebookCredential).delete({ id: foundCredential!.id });

    expect(foundCredential).not.toBeNull();
  });

  it('should return null if credential not found', async () => {
    const credential = makeFacebookCredential();

    await Database.source.getRepository(FacebookCredential).delete({ userId: credential.userId });

    const foundCredential = await facebookcredentialsRepository.findNotDeletedByUserId(credential.userId);

    expect(foundCredential).toBeNull();
  });

  it('should return null if credential is deleted', async () => {
    const credential = makeFacebookCredential();

    await Database.source.getRepository(FacebookCredential).delete({ userId: credential.userId });

    const savedCredential = await facebookcredentialsRepository.save(credential);
    
    await facebookcredentialsRepository.deleteByUserId(savedCredential.userId);

    const foundCredential = await facebookcredentialsRepository.findNotDeletedByUserId(savedCredential.userId);

    expect(foundCredential).toBeNull();
  });
});

describe('deleteByUserId', () => {
  it('should delete a credential', async () => {
    const credential = makeFacebookCredential();

    await Database.source.getRepository(FacebookCredential).delete({ userId: credential.userId });

    const savedCredential = await facebookcredentialsRepository.save(credential);
    
    await facebookcredentialsRepository.deleteByUserId(savedCredential.userId);

    const foundCredential = await facebookcredentialsRepository.findNotDeletedByUserId(savedCredential.userId);

    expect(foundCredential).toBeNull();
  });
})