import { find } from "../../../../../core/DependencyInjection";
import { UsersRepository, usersRepositoryAlias } from "../../repositories/UsersRepository";
import { UpdateUserUseCase } from "../UpdateUserUseCase";

const usecase = find(UpdateUserUseCase);

const usersRepo = find<UsersRepository>(usersRepositoryAlias);

it('should update a user', async () => {
  jest.spyOn(usersRepo, 'updateById').mockResolvedValueOnce();

  await usecase.execute({
    userId: 'id',
    name: 'John Doe',
  })

  expect(usersRepo.updateById).toHaveBeenCalledTimes(1);
  expect(usersRepo.updateById).toHaveBeenCalledWith(expect.any(String), {
    name: 'John Doe',
  });
})