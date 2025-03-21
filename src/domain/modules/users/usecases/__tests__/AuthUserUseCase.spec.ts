import { v4 as uuidv4 } from 'uuid';
import { find } from "../../../../../core/DependencyInjection";
import { UnauthorizedError } from "../../../../errors/Unauthorized";
import { HashProvider, hashProviderAlias } from "../../../../../providers/hash/HashProvider";
import { User } from "../../entities/User";
import { UsersRepository, usersRepositoryAlias } from "../../repositories/UsersRepository";
import { AuthUserUseCase } from "../AuthUserUseCase";

const usecase = find(AuthUserUseCase);
const usersRepository = find<UsersRepository>(usersRepositoryAlias);
const hashProvider = find<HashProvider>(hashProviderAlias);


it('should throw INVALID_CREDENTIALS if email is not found', async () => {
  jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue(null);

  await expect(usecase.execute({
    email: 'test@email.com',
    password: '123456',
  })).rejects.toMatchObject(new UnauthorizedError('INVALID_CREDENTIALS'));

  expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
  expect(usersRepository.findByEmail).toHaveBeenCalledWith('test@email.com');
});

it('should throw INVALID_CREDENTIALS if password does not match', async () => {
  jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue({ id: uuidv4() } as User);
  jest.spyOn(hashProvider, 'compareHash').mockResolvedValue(false);

  await expect(usecase.execute({
    email: 'test@email.com',
    password: '123456',
  })).rejects.toMatchObject(new UnauthorizedError('INVALID_CREDENTIALS'));

  expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
  expect(usersRepository.findByEmail).toHaveBeenCalledWith('test@email.com');

  expect(hashProvider.compareHash).toHaveBeenCalledTimes(1);
  expect(hashProvider.compareHash).toHaveBeenCalledWith('123456', undefined);
});

it('should return a token if credentials are valid', async () => {
  jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue({ 
    id: uuidv4(), 
    password: uuidv4(),
    canUsePlatformUntil: async () => {
      return new Date();
    },
  } as User);
  jest.spyOn(hashProvider, 'compareHash').mockResolvedValue(true);
  jest.spyOn(User, 'generateUserToken').mockResolvedValue(uuidv4());

  const res = await usecase.execute({
    email: 'test@email.com',
    password: '123456',
  });

  expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
  expect(usersRepository.findByEmail).toHaveBeenCalledWith('test@email.com');

  expect(hashProvider.compareHash).toHaveBeenCalledTimes(1);
  expect(hashProvider.compareHash).toHaveBeenCalledWith('123456', expect.any(String));

  expect(User.generateUserToken).toHaveBeenCalledTimes(1);
  expect(User.generateUserToken).toHaveBeenCalledWith({ id: expect.any(String) });

  expect(res).toMatchObject({ auth: { token: expect.any(String) } });
});