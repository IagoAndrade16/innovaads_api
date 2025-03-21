import { find } from "../../../../../core/DependencyInjection";
import { FacebookGraphApiAds, facebookGraphApiAdsAlias } from "../../../../../providers/facebook/FacebookGraphApiAds";
import { DomainError } from "../../../../errors/DomainError";
import { UserNotFoundError } from "../../../../errors/UserNotFoundError";
import { FacebookCredential } from "../../entities/FacebookCredential";
import { User } from "../../entities/User";
import { FacebookCredentialsRepository, facebookCredentialsRepositoryAlias } from "../../repositories/FacebookCredetialsRepository";
import { UsersRepository, usersRepositoryAlias } from "../../repositories/UsersRepository";
import { ConnectFacebookAccountUseCase } from "../ConnectFacebookAccountUseCase";

const usecase = find(ConnectFacebookAccountUseCase);

const usersRepository = find<UsersRepository>(usersRepositoryAlias);
const facebookCredentialsRepository = find<FacebookCredentialsRepository>(facebookCredentialsRepositoryAlias);
const facebookGraphApiAds = find<FacebookGraphApiAds>(facebookGraphApiAdsAlias);

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

it('should throw FAIL_TO_GENERATE_LONG_LIVED_ACCESS_TOKEN if fail to generate long live token', async () => {
  jest.spyOn(usersRepository, 'findById').mockResolvedValue({
    id: 'userId',
  } as User);
  jest.spyOn(facebookGraphApiAds, 'getLongLivedAccessToken').mockResolvedValue({
    status: 'BAD_REQUEST',
  });
  jest.spyOn(facebookCredentialsRepository, 'save').mockResolvedValue({} as FacebookCredential);

  await expect(usecase.execute({
    userId: 'userId',
    userIdOnFacebook: 'userIdOnFacebook',
    accessToken: 'token',
    expiresIn: 10,
  })).rejects.toEqual(new DomainError(400, 'FAIL_TO_GENERATE_LONG_LIVED_ACCESS_TOKEN'));

  expect(usersRepository.findById).toHaveBeenCalledTimes(1);
  expect(usersRepository.findById).toHaveBeenCalledWith('userId');

  expect(facebookGraphApiAds.getLongLivedAccessToken).toHaveBeenCalledTimes(1);
  expect(facebookGraphApiAds.getLongLivedAccessToken).toHaveBeenCalledWith({
    access_token: 'token',
  });
})

it('should save facebook credentials', async () => {
  jest.spyOn(usersRepository, 'findById').mockResolvedValue({
    id: 'userId',
  } as User);
  jest.spyOn(facebookGraphApiAds, 'getLongLivedAccessToken').mockResolvedValue({
    status: 'SUCCESS',
    data: {
      access_token: 'longLivedAccessToken',
      expires_in: 10,
      token_type: 'bearer',
    },
  });
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

  expect(facebookGraphApiAds.getLongLivedAccessToken).toHaveBeenCalledTimes(1);
  expect(facebookGraphApiAds.getLongLivedAccessToken).toHaveBeenCalledWith({
    access_token: 'token',
  });

  expect(facebookCredentialsRepository.save).toHaveBeenCalledTimes(1);
  expect(facebookCredentialsRepository.save).toHaveBeenCalledWith({
    userId: 'userId',
    userIdOnFacebook: 'userIdOnFacebook',
    accessToken: 'longLivedAccessToken',
    expiresIn: expect.any(Date),
  });
})