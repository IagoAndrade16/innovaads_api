import { find } from "../../../../../core/DependencyInjection";
import { EmailSenderProvider, emailSenderProviderAlias } from "../../../../../providers/mail/EmailSenderProvider";
import { RandomProvider, randomProviderAlias } from "../../../../../providers/random/RandomProvider";
import { UserNotFoundError } from "../../../../errors/UserNotFoundError";
import { User } from "../../entities/User";
import { usersForgotPassword2FARepositoryAlias, UsersForgotPassword2FARepository } from "../../repositories/UsersForgotPassword2FARepository";
import { UsersRepository, usersRepositoryAlias } from "../../repositories/UsersRepository";
import { Send2FAForgotPasswordUseCase } from "../Send2FAForgotPasswordUseCase";

const usecase = find<Send2FAForgotPasswordUseCase>(Send2FAForgotPasswordUseCase);
const usersRepository = find<UsersRepository>(usersRepositoryAlias);
const usersForgotPassword2FaRepository = find<UsersForgotPassword2FARepository>(usersForgotPassword2FARepositoryAlias);
const randomProvider = find<RandomProvider>(randomProviderAlias);
const emailSenderProvider = find<EmailSenderProvider>(emailSenderProviderAlias);

it('should throw USER_NOT_FOUND error when user not found', async () => {
  jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue(null);

  await expect(usecase.execute({
    email: 'abc@email.com',
  })).rejects.toMatchObject(new UserNotFoundError());

  expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
  expect(usersRepository.findByEmail).toHaveBeenCalledWith('abc@email.com');
});

it('should insert a new code when user forgot password code not found', async () => {
  jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue({ id: 'user-id' } as User);
  jest.spyOn(randomProvider, 'generateRandomNumber').mockResolvedValue(123456);
  jest.spyOn(usersForgotPassword2FaRepository, 'findByEmail').mockResolvedValue(null);
  jest.spyOn(usersForgotPassword2FaRepository, 'insert').mockResolvedValue();
  jest.spyOn(emailSenderProvider, 'send').mockResolvedValue();

  await usecase.execute({
    email: 'abc@email.com',
  });

  expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
  expect(usersRepository.findByEmail).toHaveBeenCalledWith('abc@email.com');

  expect(randomProvider.generateRandomNumber).toHaveBeenCalledTimes(1);
  expect(randomProvider.generateRandomNumber).toHaveBeenCalledWith(100000, 999999);

  expect(usersForgotPassword2FaRepository.findByEmail).toHaveBeenCalledTimes(1);
  expect(usersForgotPassword2FaRepository.findByEmail).toHaveBeenCalledWith('abc@email.com');

  expect(usersForgotPassword2FaRepository.insert).toHaveBeenCalledTimes(1);
  expect(usersForgotPassword2FaRepository.insert).toHaveBeenCalledWith({
    email: 'abc@email.com',
    userId: 'user-id',
    code: '123456',
  });

  expect(emailSenderProvider.send).toHaveBeenCalledTimes(1);
  expect(emailSenderProvider.send).toHaveBeenCalledWith({
    htmlContent: expect.any(String),
    to: [{
      email: 'abc@email.com',
    }],
    subject: 'Seu código de verificação - InnovaADS',
    replacements: {
      code: '123456',
    }
  });  
});