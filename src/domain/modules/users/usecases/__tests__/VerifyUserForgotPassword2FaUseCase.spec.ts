import { find } from "../../../../../core/DependencyInjection";
import { DomainError } from "../../../../errors/DomainError";
import { UserNotFoundError } from "../../../../errors/UserNotFoundError";
import { User } from "../../entities/User";
import { UserForgotPassword2FA } from "../../entities/UserForgotPassword2FA";
import { UsersForgotPassword2FARepository, usersForgotPassword2FARepositoryAlias } from "../../repositories/UsersForgotPassword2FARepository";
import { UsersRepository, usersRepositoryAlias } from "../../repositories/UsersRepository";
import { VerifyUserForgotPassword2FaUseCase } from "../VerifyUserForgotPassoword2FaUseCase";

const usecase = find<VerifyUserForgotPassword2FaUseCase>(VerifyUserForgotPassword2FaUseCase);
const usersRepository = find<UsersRepository>(usersRepositoryAlias);
const userForgotPassword2FARepository = find<UsersForgotPassword2FARepository>(usersForgotPassword2FARepositoryAlias);


it('should throw USER_NOT_FOUND error when user does not exist', async () => {
  jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue(null);
  
  await expect(usecase.execute({
    email: 'any-email',
    code: '123456',
  })).rejects.toMatchObject(new UserNotFoundError());

  expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
  expect(usersRepository.findByEmail).toHaveBeenCalledWith('any-email');
});

it('should throw CODE_NOT_FOUND if code does not exist', async () => {
  jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue({ id: 'user-id' } as User);
  jest.spyOn(userForgotPassword2FARepository, 'findLastByEmail').mockResolvedValue(null);

  await expect(usecase.execute({
    email: 'any-email',
    code: '123456',
  })).rejects.toMatchObject(new DomainError(400, 'CODE_NOT_FOUND'));

  expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
  expect(usersRepository.findByEmail).toHaveBeenCalledWith('any-email');

  expect(userForgotPassword2FARepository.findLastByEmail).toHaveBeenCalledTimes(1);
  expect(userForgotPassword2FARepository.findLastByEmail).toHaveBeenCalledWith('any-email');
}); 


it('should throw INVALID_CODE if code is already used', async () => {
  jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue({ id: 'user-id' } as User);
  jest.spyOn(userForgotPassword2FARepository, 'findLastByEmail').mockResolvedValue({ id: 'code-id', alreadyUsed: true } as UserForgotPassword2FA);

  await expect(usecase.execute({
    email: 'any-email',
    code: '123456',
  })).rejects.toMatchObject(new DomainError(400, 'INVALID_CODE'));

  expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
  expect(usersRepository.findByEmail).toHaveBeenCalledWith('any-email');

  expect(userForgotPassword2FARepository.findLastByEmail).toHaveBeenCalledTimes(1);
  expect(userForgotPassword2FARepository.findLastByEmail).toHaveBeenCalledWith('any-email');
});

it('should throw INVALID_CODE if code sent is different', async () => {
  jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue({ id: 'user-id' } as User);
  jest.spyOn(userForgotPassword2FARepository, 'findLastByEmail').mockResolvedValue({ id: 'code-id', alreadyUsed: false, code: '654321' } as UserForgotPassword2FA);

  await expect(usecase.execute({
    email: 'any-email',
    code: '123456',
  })).rejects.toMatchObject(new DomainError(400, 'INVALID_CODE'));

  expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
  expect(usersRepository.findByEmail).toHaveBeenCalledWith('any-email');

  expect(userForgotPassword2FARepository.findLastByEmail).toHaveBeenCalledTimes(1);
  expect(userForgotPassword2FARepository.findLastByEmail).toHaveBeenCalledWith('any-email');
});


it('should throw INVALID_CODE if code sent is different', async () => {
  jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue({ id: 'user-id' } as User);
  jest.spyOn(userForgotPassword2FARepository, 'findLastByEmail').mockResolvedValue({ id: 'code-id', alreadyUsed: false, code: '123456' } as UserForgotPassword2FA);
  jest.spyOn(userForgotPassword2FARepository, 'updateById').mockResolvedValue();

  await usecase.execute({
    email: 'any-email',
    code: '123456',
  });

  expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
  expect(usersRepository.findByEmail).toHaveBeenCalledWith('any-email');

  expect(userForgotPassword2FARepository.findLastByEmail).toHaveBeenCalledTimes(1);
  expect(userForgotPassword2FARepository.findLastByEmail).toHaveBeenCalledWith('any-email');

  expect(userForgotPassword2FARepository.updateById).toHaveBeenCalledTimes(1);
  expect(userForgotPassword2FARepository.updateById).toHaveBeenCalledWith('code-id', {
    alreadyUsed: true,
  });
});