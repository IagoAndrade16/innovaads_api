import { find } from "../../../../../../core/DependencyInjection";
import { Utils } from "../../../../../../core/Utils";
import { UserForgotPassword2FA } from "../../../../../../domain/modules/users/entities/UserForgotPassword2FA";
import { UsersForgotPassword2FARepository, usersForgotPassword2FARepositoryAlias } from "../../../../../../domain/modules/users/repositories/UsersForgotPassword2FARepository";
import { Database } from "../../../../Database";

const repository = find<UsersForgotPassword2FARepository>(usersForgotPassword2FARepositoryAlias);

beforeAll(async () => {
  await Database.initialize();
});

afterAll(async () => {
  await Database.close();
});

describe('insert', () => {
  it('should insert a user forgot password 2fa', async () => {
    await repository.insert({
      code: 'code',
      email: 'email',
      userId: 'userId',
    })

    const userForgotPassword2FA = await Database.source.getRepository('UserForgotPassword2FA').findOne({ where: { email: 'email' } });

    await Database.source.getRepository('UserForgotPassword2FA').delete(userForgotPassword2FA?.id);

    expect(userForgotPassword2FA).toEqual(expect.objectContaining({
      code: 'code',
      email: 'email',
      userId: 'userId',
    }));
  })
})

describe('updateById', () => {
  it('should update a user forgot password 2fa by id', async () => {
    const userForgotPassword2FA = await Database.source.getRepository(UserForgotPassword2FA).save({
      code: 'code',
      email: 'email',
      userId: 'userId',
    });

    await repository.updateById(userForgotPassword2FA.id, {
      code: 'code2',
    });

    const updatedUserForgotPassword2FA = await Database.source.getRepository(UserForgotPassword2FA).findOne({
      where: { id: userForgotPassword2FA.id }
    });

    await Database.source.getRepository(UserForgotPassword2FA).delete(userForgotPassword2FA.id);

    expect(updatedUserForgotPassword2FA).toEqual(expect.objectContaining({
      code: 'code2',
      email: 'email',
      userId: 'userId',
    }));
  })
})

describe('findByEmail', () => {
  it('should find a user forgot password 2fa by email', async () => {
    const userForgotPassword2FA = await Database.source.getRepository(UserForgotPassword2FA).save({
      code: 'code',
      email: 'email',
      userId: 'userId',
    });

    const foundUserForgotPassword2FA = await repository.findByEmail('email');

    await Database.source.getRepository(UserForgotPassword2FA).delete(userForgotPassword2FA.id);

    expect(foundUserForgotPassword2FA).toEqual(expect.objectContaining({
      code: 'code',
      email: 'email',
      userId: 'userId',
    }));
  })
})

describe('findLastByEmail', () => {
  it('should find the last user forgot password 2fa by email', async () => {
    const userForgotPassword2FA = await Database.source.getRepository(UserForgotPassword2FA).save({
      code: 'code',
      email: 'email',
      userId: 'userId',
    });

    await Utils.sleep(1000);

    const userForgotPassword2FA2 = await Database.source.getRepository(UserForgotPassword2FA).save({
      code: 'code2',
      email: 'email',
      userId: 'userId',
    });

    const foundUserForgotPassword2FA = await repository.findLastByEmail('email');

    await Database.source.getRepository(UserForgotPassword2FA).delete(userForgotPassword2FA.id);
    await Database.source.getRepository(UserForgotPassword2FA).delete(userForgotPassword2FA2.id);

    expect(foundUserForgotPassword2FA).toEqual(expect.objectContaining({
      code: 'code2',
      email: 'email',
      userId: 'userId',
    }));
  })
})