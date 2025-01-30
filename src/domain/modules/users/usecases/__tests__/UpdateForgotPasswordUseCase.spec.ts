import { find } from "../../../../../core/DependencyInjection";
import { HashProvider, hashProviderAlias } from "../../../../../providers/hash/HashProvider";
import { UserNotFoundError } from "../../../../errors/UserNotFoundError";
import { User } from "../../entities/User";
import { UsersRepository, usersRepositoryAlias } from "../../repositories/UsersRepository";
import { UpdateForgotUserPasswordUseCase } from "../UpdateForgotUserPasswordUseCase";



const usecase = find<UpdateForgotUserPasswordUseCase>(UpdateForgotUserPasswordUseCase);
const usersRepository = find<UsersRepository>(usersRepositoryAlias);
const hashProvider = find<HashProvider>(hashProviderAlias);

it('should throw USER_NOT_FOUND error when user does not exist', async () => {
  jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue(null);
  
  await expect(usecase.execute({
    email: 'any-email',
    newPassword: 'any-password',
  })).rejects.toMatchObject(new UserNotFoundError());

  expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
  expect(usersRepository.findByEmail).toHaveBeenCalledWith('any-email');
});

it('should update user password', async () => {
  jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue({ id: 'user-id' } as User);
  jest.spyOn(hashProvider, 'generateHash').mockResolvedValue('hashed-password');
  jest.spyOn(usersRepository, 'updateById').mockResolvedValue();

  await usecase.execute({
    email: 'any-email',
    newPassword: 'any-password',
  });


  expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
  expect(usersRepository.findByEmail).toHaveBeenCalledWith('any-email');

  expect(usersRepository.updateById).toHaveBeenCalledTimes(1);
  expect(usersRepository.updateById).toHaveBeenCalledWith('user-id', {
    password: 'hashed-password',
  });
});