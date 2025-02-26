import { find } from "../../../../../core/DependencyInjection";
import { UserNotFoundError } from "../../../../errors/UserNotFoundError";
import { FacebookCredential } from "../../entities/FacebookCredential";
import { User } from "../../entities/User";
import { FacebookCredentialsRepository, facebookCredentialsRepositoryAlias } from "../../repositories/FacebookCredetialsRepository";
import { UsersRepository, usersRepositoryAlias } from "../../repositories/UsersRepository";
import { ConnectFacebookAccountUseCase } from "../ConnectFacebookAccountUseCase";

const usecase = find(ConnectFacebookAccountUseCase);

const usersRepository = find<UsersRepository>(usersRepositoryAlias);
const facebookCredentialsRepository = find<FacebookCredentialsRepository>(facebookCredentialsRepositoryAlias);

it('should throw USER_NOT_FOUND error if user does not exist', async () => {
  jest.spyOn(usersRepository, 'findById').mockResolvedValue(null);

  await expect(usecase.execute({
    userId: 'userId',
    userIdOnFacebook: 'userIdOnFacebook',
    accessToken: 'token',
    expiresIn: 10,
  })).rejects.toEqual(new UserNotFoundError());

  expect(usersRepository.findById).toHaveBeenCalledTimes(1);
  expect(usersRepository.findById).toHaveBeenCalledWith('userId');
});

it('should save facebook credentials', async () => {
  jest.spyOn(usersRepository, 'findById').mockResolvedValue({
    id: 'userId',
  } as User);
  jest.spyOn(facebookCredentialsRepository, 'save').mockResolvedValue({} as FacebookCredential);

  const res = await usecase.execute({
    userId: 'userId',
    userIdOnFacebook: 'userIdOnFacebook',
    accessToken: 'token',
    expiresIn: 10,
  });

  expect(res).toEqual({
    facebookCredential: {},
  });

  expect(usersRepository.findById).toHaveBeenCalledTimes(1);
  expect(usersRepository.findById).toHaveBeenCalledWith('userId');

  expect(facebookCredentialsRepository.save).toHaveBeenCalledTimes(1);
  expect(facebookCredentialsRepository.save).toHaveBeenCalledWith({
    userId: 'userId',
    userIdOnFacebook: 'userIdOnFacebook',
    accessToken: 'token',
    expiresIn: expect.any(Date),
  });
})