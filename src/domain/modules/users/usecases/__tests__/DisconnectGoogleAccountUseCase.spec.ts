import { find } from "../../../../../core/DependencyInjection";
import { UserNotFoundError } from "../../../../errors/UserNotFoundError";
import { User } from "../../entities/User";
import { GoogleCredentialsRepository, googleCredentialsRepositoryAlias } from "../../repositories/GoogleCredentialsRepository";
import { UsersRepository, usersRepositoryAlias } from "../../repositories/UsersRepository";
import { DisconnectGoogleAccountUseCase } from "../DisconnectGoogleAccountUseCase";

const usecase = find<DisconnectGoogleAccountUseCase>(DisconnectGoogleAccountUseCase);
const usersRepository = find<UsersRepository>(usersRepositoryAlias);
const googleCredentialsRepository = find<GoogleCredentialsRepository>(googleCredentialsRepositoryAlias);

it('should throw USER_NOT_FOUND error if user does not exist', async () => {
  jest.spyOn(usersRepository, 'findById').mockResolvedValue(null);

  await expect(usecase.execute({
    userId: 'userId',
  })).rejects.toEqual(new UserNotFoundError());

  expect(usersRepository.findById).toHaveBeenCalledTimes(1);
  expect(usersRepository.findById).toHaveBeenCalledWith('userId');
});

it('should delete user`s google account', async () => {
  jest.spyOn(usersRepository, 'findById').mockResolvedValue({ id: 'id' } as User);
  jest.spyOn(googleCredentialsRepository, 'deleteByUserId').mockResolvedValue();

  await usecase.execute({
    userId: 'id',
  });

  expect(usersRepository.findById).toHaveBeenCalledTimes(1);
  expect(usersRepository.findById).toHaveBeenCalledWith('id');

  expect(googleCredentialsRepository.deleteByUserId).toHaveBeenCalledTimes(1);
  expect(googleCredentialsRepository.deleteByUserId).toHaveBeenCalledWith('id');
})