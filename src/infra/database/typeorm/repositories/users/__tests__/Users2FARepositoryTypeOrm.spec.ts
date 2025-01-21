import { find } from "../../../../../../core/DependencyInjection";
import { Utils } from "../../../../../../core/Utils";
import { UniqueEntityID } from "../../../../../../domain/entities/UniqueEntityID";
import { User2FA } from "../../../../../../domain/modules/users/entities/User2FA";
import { Users2FARepository, users2FARepositoryAlias } from "../../../../../../domain/modules/users/repositories/Users2FARepository";
import { Database } from "../../../Database";


const repository = find<Users2FARepository>(users2FARepositoryAlias);

beforeAll(async () => {
  await Database.initialize();
});

afterAll(async () => {
  await Database.close();
});

describe('insert', () => {
  it('should insert a new user 2fa', async () => {
    const userId = new UniqueEntityID();
    await repository.insert({
      userId,
      code: '123456',
      email: 'email@email.com',
    });

    const lastCode = await repository.findLastCodeByUserId(userId);

    expect(lastCode).not.toBeNull();
    expect(lastCode!.code).toBe('123456');
  });
})

describe('findLastCodeByUserId', () => {
  it('should return null if user 2fa not found', async () => {
    const userId = new UniqueEntityID();
    const lastCode = await repository.findLastCodeByUserId(userId);

    expect(lastCode).toBeNull();
  });

  it('should return the last code for the user 2fa', async () => {
    const userId = new UniqueEntityID();
    await repository.insert({
      userId,
      code: '1',
      email: 'email@email.com',
    });

    await Utils.sleep(1000)

    await repository.insert({
      userId,
      code: '2',
      email: 'email@email.com',
    });

    const lastCode = await repository.findLastCodeByUserId(userId);

    await Database.source.getRepository(User2FA).delete({ userId: userId });

    expect(lastCode).not.toBeNull();
    expect(lastCode!.code).toBe('2');
  });
})

describe('updateById', () => {
  it('should update a user', async () => {
    const userId = new UniqueEntityID();
    const user2fa = await repository.insert({
      userId,
      code: '123456',
      email: 'email',
    })

    await repository.updateById(user2fa.id, {
      alreadyUsed: true,
    })

    const updatedUser = await repository.findLastCodeByUserId(userId);

    await Database.source.getRepository(User2FA).delete({ userId: userId });

    expect(updatedUser?.alreadyUsed).toBe(true);
  })
})