import { find } from "../../../../../core/DependencyInjection";
import { DomainError } from "../../../../errors/DomainError";

import { User } from "../../entities/User";
import { User2FA } from "../../entities/User2FA";
import { Users2FARepository, users2FARepositoryAlias } from "../../repositories/Users2FARepository";
import { UsersRepository, usersRepositoryAlias } from "../../repositories/UsersRepository";
import { VerifyUser2FACodeUseCase } from "../VerifyUser2FACodeUseCase";
import { UserNotFoundError } from "../../../../errors/UserNotFoundError";

const usecase = find(VerifyUser2FACodeUseCase);

const usersRepo = find<UsersRepository>(usersRepositoryAlias);
const users2FaRepo = find<Users2FARepository>(users2FARepositoryAlias);

const userId = 'id';

it('should throw an error if user not found', async () => {
  jest.spyOn(usersRepo, 'findById').mockResolvedValue(null);

  await expect(usecase.execute({ userId, code: '123' })).rejects.toEqual(new UserNotFoundError());

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith(userId);
})

it('should CODE_NOT_FOUND if user has no 2FA code', async () => {
  jest.spyOn(usersRepo, 'findById').mockResolvedValue({ id: userId } as User);
  jest.spyOn(users2FaRepo, 'findLastCodeByUserId').mockResolvedValue(null);

  await expect(usecase.execute({ userId, code: '123' })).rejects.toEqual(new DomainError(400, 'CODE_NOT_FOUND'));

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith(userId);

  expect(users2FaRepo.findLastCodeByUserId).toHaveBeenCalledTimes(1);
  expect(users2FaRepo.findLastCodeByUserId).toHaveBeenCalledWith(userId);
});

it('should throw INVALID_CODE if code is invalid', async () => {
  jest.spyOn(usersRepo, 'findById').mockResolvedValue({ id: userId } as User);
  jest.spyOn(users2FaRepo, 'findLastCodeByUserId').mockResolvedValue({ code: '1234' } as User2FA);

  await expect(usecase.execute({ userId, code: '4321' })).rejects.toEqual(new DomainError(400, 'INVALID_CODE'));

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith(userId);

  expect(users2FaRepo.findLastCodeByUserId).toHaveBeenCalledTimes(1);
  expect(users2FaRepo.findLastCodeByUserId).toHaveBeenCalledWith(userId);
});

it('should update 2FA code to alreadyUsed', async () => {
  jest.spyOn(usersRepo, 'findById').mockResolvedValue({ id: userId } as User);
  jest.spyOn(users2FaRepo, 'findLastCodeByUserId').mockResolvedValue({ id: userId, code: '1234' } as User2FA);
  jest.spyOn(users2FaRepo, 'updateById').mockResolvedValue();

  await usecase.execute({ userId, code: '1234' });

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith(userId);

  expect(users2FaRepo.findLastCodeByUserId).toHaveBeenCalledTimes(1);
  expect(users2FaRepo.findLastCodeByUserId).toHaveBeenCalledWith(userId);

  expect(users2FaRepo.updateById).toHaveBeenCalledTimes(1);
  expect(users2FaRepo.updateById).toHaveBeenCalledWith(userId, { alreadyUsed: true });
});
