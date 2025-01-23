import { find } from "../../../../../../core/DependencyInjection";
import { User } from "../../../../../../domain/modules/users/entities/User";
import { UsersRepository, usersRepositoryAlias } from "../../../../../../domain/modules/users/repositories/UsersRepository";
import { Database } from "../../../../Database";


const usersRepository = find<UsersRepository>(usersRepositoryAlias);

beforeAll(async () => {
  await Database.initialize();
});

afterAll(async () => {
  await Database.close();
});

describe('insert', () => {
  it('should insert a new user', async () => {
    const user = await usersRepository.insert({
      email: 'test@email.com',
      name: 'test',
      password: 'test',
      phone: 'test'
    })

    await Database.source.getRepository(User).delete({ id: user.id});
  
    expect(user).not.toBeNull();
  })
});

describe('findById', () => {
  it('should return null if user does not exist', async () => {
    const user = await usersRepository.findById('id');

    expect(user).toBeNull();
  })

  it('should return a user', async () => {
    const user = await usersRepository.insert({
      email: 'email@email.com',
      name: 'test',
      password: 'test',
      phone: 'test'
    })

    const foundUser = await usersRepository.findById(user.id);

    await Database.source.getRepository(User).delete({ id: user.id });

    expect(foundUser).not.toBeNull();
    expect(foundUser?.id).toBe(user.id);
  })
});

describe('findByEmail', () => {
  it('should return null if user does not exist', async () => {
    const user = await usersRepository.findByEmail('email');

    expect(user).toBeNull();
  })

  it('should return a user', async () => {
    const user = await usersRepository.insert({
      email: 'email@email.com',
      name: 'test',
      password: 'test',
      phone: 'test'
    })

    const foundUser = await usersRepository.findByEmail(user.email);

    await Database.source.getRepository(User).delete({ id: user.id });

    expect(foundUser).not.toBeNull();
    expect(foundUser?.email).toBe(user.email);
  })
})

describe('updateById', () => {
  it('should update a user', async () => {
    const user = await usersRepository.insert({
      email: 'email@email.com',
      name: 'test',
      password: 'test',
      phone: 'test'
    })

    await usersRepository.updateById(user.id, {
      name: 'update name',
    })

    const updatedUser = await usersRepository.findById(user.id);
    await Database.source.getRepository(User).delete({ id: user.id });

    expect(updatedUser?.name).toBe('update name');
  })
})