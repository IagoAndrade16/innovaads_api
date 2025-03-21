import { find } from "../../../../../core/DependencyInjection";
import { GetAuthTokenResponse } from "../../../../../providers/google/@types/GoogleAuthProviderTypes";
import { GoogleAuthProvider, googleAuthProviderAlias } from "../../../../../providers/google/GoogleAuthProvider";
import { DomainError } from "../../../../errors/DomainError";
import { UserNotFoundError } from "../../../../errors/UserNotFoundError";
import { GoogleCredential } from "../../entities/GoogleCredential";
import { User } from "../../entities/User";
import { GoogleCredentialsRepository, googleCredentialsRepositoryAlias } from "../../repositories/GoogleCredentialsRepository";
import { UsersRepository, usersRepositoryAlias } from "../../repositories/UsersRepository";
import { ConnectGoogleAccountUseCase } from "../ConnectGoogleAccountUseCase";


const usecase = find<ConnectGoogleAccountUseCase>(ConnectGoogleAccountUseCase);
const usersRepository = find<UsersRepository>(usersRepositoryAlias);
const googleAuthProvider = find<GoogleAuthProvider>(googleAuthProviderAlias);
const googleCredentialsRepository = find<GoogleCredentialsRepository>(googleCredentialsRepositoryAlias);

it('should throw USER_NOT_FOUND error if user does not exist', async () => {
  jest.spyOn(usersRepository, 'findById').mockResolvedValue(null);

  await expect(usecase.execute({
    userId: 'userId',
    code: 'code',
  })).rejects.toEqual(new UserNotFoundError());

  expect(usersRepository.findById).toHaveBeenCalledTimes(1);
  expect(usersRepository.findById).toHaveBeenCalledWith('userId');
});

it('should throw FAILED_TO_CONNECT_ACCOUNT error if user can`t connect your google account', async () => {
  jest.spyOn(usersRepository, 'findById').mockResolvedValue({ id: 'id' } as User);
  jest.spyOn(googleAuthProvider, 'getAuthToken').mockResolvedValue({
    status: 'BAD_REQUEST',
    data: null,
  } as GetAuthTokenResponse);

  await expect(usecase.execute({
    userId: 'userId',
    code: 'code',
  })).rejects.toEqual(new DomainError(400, 'FAILED_TO_CONNECT_ACCOUNT'));

  expect(usersRepository.findById).toHaveBeenCalledTimes(1);
  expect(usersRepository.findById).toHaveBeenCalledWith('userId');

  expect(googleAuthProvider.getAuthToken).toHaveBeenCalledTimes(1);
  expect(googleAuthProvider.getAuthToken).toHaveBeenCalledWith({
    code: 'code',
  });
});

it('should connect google account', async () => {
  jest.spyOn(usersRepository, 'findById').mockResolvedValue({ id: 'id' } as User);
  jest.spyOn(googleCredentialsRepository, 'insert').mockResolvedValue({
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
    expiresIn: new Date(),
    expiresRefreshIn: new Date(),
    userId: 'userId',
  } as GoogleCredential);  
  jest.spyOn(googleAuthProvider, 'getAuthToken').mockResolvedValue({
    status: 'SUCCESS',
    data: {
      access_token: 'access_token',
      refresh_token: 'refresh_token',
      expires_in: 3600,
      refresh_token_expires_in: 3600,
      scope: 'scope',
      token_type: 'Bearer',
    },
  } as GetAuthTokenResponse);

  const res = await usecase.execute({
    userId: 'userId',
    code: 'code',
  });

  expect(res).toEqual({
    googleCredential: {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      expiresIn: expect.any(Date),
      expiresRefreshIn: expect.any(Date),
      userId: 'userId',
    }
  });  

  expect(usersRepository.findById).toHaveBeenCalledTimes(1);
  expect(usersRepository.findById).toHaveBeenCalledWith('userId');

  expect(googleAuthProvider.getAuthToken).toHaveBeenCalledTimes(1);
  expect(googleAuthProvider.getAuthToken).toHaveBeenCalledWith({
    code: 'code',
  });
}); 