import { find } from "../../../../../core/DependencyInjection";
import { HashProvider, hashProviderAlias } from "../../../../../providers/hash/HashProvider";
import { UniqueEntityID } from "../../../../entities/UniqueEntityID";
import { DomainError } from "../../../../errors/DomainError";
import { UserNotFoundError } from "../../../../errors/UserNotFoundError";
import { User } from "../../entities/User";
import { UsersRepository, usersRepositoryAlias } from "../../repositories/UsersRepository";
import { UpdateUserPasswordUseCase } from "../UpdateUserPasswordUseCase";

const usecase = find(UpdateUserPasswordUseCase);

const usersRepo = find<UsersRepository>(usersRepositoryAlias);
const hashProvider = find<HashProvider>(hashProviderAlias);

const userId =  new UniqueEntityID();

it('should throw error if user not found', async () => {
  jest.spyOn(usersRepo, 'findById').mockResolvedValue(null);

  await expect(usecase.execute({
    userId,
    actualPassword: '123',
    newPassword: '1234'
  })).rejects.toEqual(new UserNotFoundError());

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith(userId);
})

it('should throw error if actual password does not match', async () => {
  jest.spyOn(usersRepo, 'findById').mockResolvedValue({
    id: userId,
    password: '123'
  } as User);

  jest.spyOn(hashProvider, 'compareHash').mockResolvedValue(false);

  await expect(usecase.execute({
    userId,
    actualPassword: '123',
    newPassword: '1234'
  })).rejects.toEqual(new DomainError(400, 'INVALID_PASSWORD'));

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith(userId);

  expect(hashProvider.compareHash).toHaveBeenCalledTimes(1);
  expect(hashProvider.compareHash).toHaveBeenCalledWith('123', '123');
})

it('should update user password', async () => {
  jest.spyOn(usersRepo, 'findById').mockResolvedValue({
    id: userId,
    password: '123'
  } as User);

  jest.spyOn(hashProvider, 'compareHash').mockResolvedValue(true);
  jest.spyOn(hashProvider, 'generateHash').mockResolvedValue('1234');
  jest.spyOn(usersRepo, 'updateById').mockResolvedValue();

  await usecase.execute({
    userId,
    actualPassword: '123',
    newPassword: '1234'
  });

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith(userId);

  expect(hashProvider.compareHash).toHaveBeenCalledTimes(1);
  expect(hashProvider.compareHash).toHaveBeenCalledWith('123', '123');

  expect(hashProvider.generateHash).toHaveBeenCalledTimes(1);
  expect(hashProvider.generateHash).toHaveBeenCalledWith('1234');

  expect(usersRepo.updateById).toHaveBeenCalledTimes(1);
  expect(usersRepo.updateById).toHaveBeenCalledWith(userId, {
    password: '1234'
  });
})