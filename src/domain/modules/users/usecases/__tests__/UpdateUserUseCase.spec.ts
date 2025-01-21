import { find } from "../../../../../core/DependencyInjection";
import { UniqueEntityID } from "../../../../entities/UniqueEntityID";
import { UsersRepository, usersRepositoryAlias } from "../../repositories/UsersRepository";
import { UpdateUserUseCase } from "../UpdateUserUseCase";

const usecase = find(UpdateUserUseCase);

const usersRepo = find<UsersRepository>(usersRepositoryAlias);

it('should update a user', async () => {
  jest.spyOn(usersRepo, 'updateById').mockResolvedValueOnce();

  await usecase.execute({
    userId: new UniqueEntityID(),
    name: 'John Doe',
  })

  expect(usersRepo.updateById).toHaveBeenCalledTimes(1);
  expect(usersRepo.updateById).toHaveBeenCalledWith(expect.any(UniqueEntityID), {
    name: 'John Doe',
  });
})