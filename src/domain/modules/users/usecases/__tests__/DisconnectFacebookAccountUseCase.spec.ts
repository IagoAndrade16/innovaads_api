import { find } from "../../../../../core/DependencyInjection";
import { UserNotFoundError } from "../../../../errors/UserNotFoundError";
import { User } from "../../entities/User";
import { FacebookCredentialsRepository, facebookCredentialsRepositoryAlias } from "../../repositories/FacebookCredetialsRepository";
import { UsersRepository, usersRepositoryAlias } from "../../repositories/UsersRepository";
import { DisconnectFacebookAccountUseCase } from "../DisconnectFacebookAccountUseCase";

const usecase = find(DisconnectFacebookAccountUseCase);

const usersRepository = find<UsersRepository>(usersRepositoryAlias);
const facebookCredentialsRepository = find<FacebookCredentialsRepository>(facebookCredentialsRepositoryAlias);

it('should throw USER_NOT_FOUND error if user does not exist', async () => {
  jest.spyOn(usersRepository, 'findById').mockResolvedValue(null);

  await expect(usecase.execute({
    userId: 'userId',
  })).rejects.toEqual(new UserNotFoundError());

  expect(usersRepository.findById).toHaveBeenCalledTimes(1);
  expect(usersRepository.findById).toHaveBeenCalledWith('userId');
});

it('should save facebook credentials', async () => {
  jest.spyOn(usersRepository, 'findById').mockResolvedValue({
    id: 'userId',
  } as User);
  jest.spyOn(facebookCredentialsRepository, 'deleteByUserId').mockResolvedValue();

  await usecase.execute({
    userId: 'userId',
  });

  expect(usersRepository.findById).toHaveBeenCalledTimes(1);
  expect(usersRepository.findById).toHaveBeenCalledWith('userId');

  expect(facebookCredentialsRepository.deleteByUserId).toHaveBeenCalledTimes(1);
  expect(facebookCredentialsRepository.deleteByUserId).toHaveBeenCalledWith('userId');
})