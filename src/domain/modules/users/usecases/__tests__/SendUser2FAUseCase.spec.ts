import { find } from "../../../../../core/DependencyInjection";

import { EmailSenderProvider, emailSenderProviderAlias } from "../../../../../providers/mail/EmailSenderProvider";
import { RandomProvider, randomProviderAlias } from "../../../../../providers/random/RandomProvider";
import { UniqueEntityID } from "../../../../entities/UniqueEntityID";
import { UserNotFoundError } from "../../../../errors/UserNotFoundError";
import { User } from "../../entities/User";
import { User2FA } from "../../entities/User2FA";
import { Users2FARepository, users2FARepositoryAlias } from "../../repositories/Users2FARepository";
import { UsersRepository, usersRepositoryAlias } from "../../repositories/UsersRepository";
import { SendUser2FAUseCase } from "../SendUser2FAUseCase";

const usecase = find(SendUser2FAUseCase);

const usersRepo = find<UsersRepository>(usersRepositoryAlias);
const users2FaRepo = find<Users2FARepository>(users2FARepositoryAlias);
const randomProvider = find<RandomProvider>(randomProviderAlias);
const emailSender = find<EmailSenderProvider>(emailSenderProviderAlias);

const userId = new UniqueEntityID();

it('should throw an error if user not found', async () => {
  jest.spyOn(usersRepo, 'findById').mockResolvedValue(null);

  await expect(usecase.execute({ userId })).rejects.toEqual(new UserNotFoundError());

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith(userId);
})

it('should generate code and sent it by email', async () => {
  jest.spyOn(usersRepo, 'findById').mockResolvedValue({ 
    id: userId, 
    email: 'name@email.com', 
    name: 'Name' 
  } as User);
  jest.spyOn(randomProvider, 'generateRandomNumber').mockResolvedValue(123456);
  jest.spyOn(users2FaRepo, 'findLastCodeByUserId').mockResolvedValue(null);
  jest.spyOn(users2FaRepo, 'insert').mockResolvedValue({} as User2FA);
  jest.spyOn(usecase, 'sendCodeByEmail').mockResolvedValue();

  await usecase.execute({ userId });

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith(userId);

  expect(randomProvider.generateRandomNumber).toHaveBeenCalledTimes(1);
  expect(randomProvider.generateRandomNumber).toHaveBeenCalledWith(100000, 999999);

  expect(users2FaRepo.findLastCodeByUserId).toHaveBeenCalledTimes(1);
  expect(users2FaRepo.findLastCodeByUserId).toHaveBeenCalledWith(userId);

  expect(users2FaRepo.insert).toHaveBeenCalledTimes(1);
  expect(users2FaRepo.insert).toHaveBeenCalledWith({
    userId,
    email: 'name@email.com',
    code: '123456',
  });
})

it('should update code if already exists', async () => {
  jest.spyOn(usersRepo, 'findById').mockResolvedValue({ 
    id: userId, 
    email: 'name@email.com',
    name: 'Name'
  } as User);
  jest.spyOn(randomProvider, 'generateRandomNumber').mockResolvedValue(123456);
  jest.spyOn(users2FaRepo, 'findLastCodeByUserId').mockResolvedValue({ id: new UniqueEntityID() } as User2FA); 
  jest.spyOn(users2FaRepo, 'updateById').mockResolvedValue();
  jest.spyOn(usecase, 'sendCodeByEmail').mockResolvedValue();

  await usecase.execute({ userId });

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith(userId);

  expect(randomProvider.generateRandomNumber).toHaveBeenCalledTimes(1);
  expect(randomProvider.generateRandomNumber).toHaveBeenCalledWith(100000, 999999);

  expect(users2FaRepo.findLastCodeByUserId).toHaveBeenCalledTimes(1);
  expect(users2FaRepo.findLastCodeByUserId).toHaveBeenCalledWith(userId);

  expect(users2FaRepo.updateById).toHaveBeenCalledTimes(1);
  expect(users2FaRepo.updateById).toHaveBeenCalledWith(expect.any(UniqueEntityID), {
    code: '123456',
  });

  expect(usecase.sendCodeByEmail).toHaveBeenCalledTimes(1);
  expect(usecase.sendCodeByEmail).toHaveBeenCalledWith({
    code: '123456',
    email: 'name@email.com',
    name: 'Name',
  });
})

describe('sendCodeByEmail', () => {
  it('should send code by email', async () => {
    jest.spyOn(emailSender, 'send').mockResolvedValue();

    await usecase.sendCodeByEmail({
      code: '123456',
      email: 'name@email.com',
      name: 'Name',
    });

    expect(emailSender.send).toHaveBeenCalledTimes(1);
    expect(emailSender.send).toHaveBeenCalledWith({
      htmlContent: expect.any(String),
      subject: expect.any(String),
      to: expect.arrayContaining([
        expect.objectContaining({ email: 'name@email.com' })
      ]),
      replacements: expect.any(Object),
    });
  });
})

