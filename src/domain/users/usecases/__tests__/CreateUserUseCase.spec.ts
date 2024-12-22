import { find } from "../../../../core/DependencyInjection";
import { DomainError } from "../../../../infra/errors/DomainError";
import { User } from "../../entities/User";
import { UsersRepository, usersRepositoryAlias } from "../../repositories/UsersRepository";
import { CreateUserUseCase } from "../CreateUserUseCase";

const usecase = find(CreateUserUseCase);
const usersRepository = find<UsersRepository>(usersRepositoryAlias);

it('should throw USER_FOUND if user already exists', async () => {
  jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue({ id: 'adsf' } as User);

  await expect(usecase.execute({
    name: 'John Doe',
    email: 'test@email.com',
    password: '123456',
    phone: '123456789'
  })).rejects.toMatchObject(new DomainError(400, 'USER_ALREADY_EXISTS'));

  expect(usersRepository.findByEmail).toBeCalledTimes(1);
  expect(usersRepository.findByEmail).toBeCalledWith('test@email.com');
});

it('should create a user', async () => {
  jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue(null);
  jest.spyOn(usersRepository, 'insert').mockResolvedValue({ id: 'ehw' } as User);

  await usecase.execute({
    name: 'John Doe',
    email: 'test@email.com',
    password: '123456',
    phone: '123456789'
  });

  expect(usersRepository.findByEmail).toBeCalledTimes(1);
  expect(usersRepository.findByEmail).toBeCalledWith('test@email.com');

  expect(usersRepository.insert).toBeCalledTimes(1);
  expect(usersRepository.insert).toBeCalledWith({
    name: 'John Doe',
    email: 'test@email.com',
    password: expect.any(String),
    phone: '123456789'
  });
})
