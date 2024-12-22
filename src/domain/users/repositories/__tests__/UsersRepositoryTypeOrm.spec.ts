import { Database } from "../../../../database/Database";
import { find } from "../../../../core/DependencyInjection";
import { UsersRepository, usersRepositoryAlias } from "../UsersRepository";
import { User } from "../../entities/User";

const usersRepository = find<UsersRepository>(usersRepositoryAlias);

beforeAll(async () => {
  await Database.initialize();
});

describe('insert', () => {
  it('should insert a new user', async () => {
    const user = await usersRepository.insert({
      email: 'test@email.com',
      name: 'test',
      password: 'test',
      phone: 'test'
    })

    await Database.source.getRepository(User).delete(user.id);
  
    expect(user).not.toBeNull();
  })
});

afterAll(async () => {
  await Database.close();
});