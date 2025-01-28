import { find } from "../../../../../core/DependencyInjection";
import { ForbiddenError } from "../../../../errors/ForbiddenError";
import { UserNotFoundError } from "../../../../errors/UserNotFoundError";
import { User } from "../../../users/entities/User";
import { UsersRepository, usersRepositoryAlias } from "../../../users/repositories/UsersRepository";
import { Package } from "../../entities/Package";
import { PackagesRepository, packagesRepositoryAlias } from "../../repositories/PackagesRepository";
import { CreatePackageUseCase } from "../CreatePackageUseCase";

const usecase = find(CreatePackageUseCase);

const packagesRepository = find<PackagesRepository>(packagesRepositoryAlias);
const usersRepo = find<UsersRepository>(usersRepositoryAlias);

it('should thorw error if user not found', async () => {
  jest.spyOn(usersRepo, 'findById').mockResolvedValue(null);

  await expect(usecase.execute({
    userId: '1',
    package: {
      name: 'name',
      description: 'description',
      price: 1,
    },
    details: [{
      description: 'detail',
    }],
  })).rejects.toEqual(new UserNotFoundError());

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith('1');
})

it('should throw error if user is not admin', async () => {
  jest.spyOn(usersRepo, 'findById').mockResolvedValue({
    id: '1',
    role: 'user',
  } as User);

  await expect(usecase.execute({
    userId: '1',
    package: {
      name: 'name',
      description: 'description',
      price: 1,
    },
    details: [{
      description: 'detail',
    }],
  })).rejects.toEqual(new ForbiddenError());

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith('1');
});

it('should create package', async () => {
  jest.spyOn(usersRepo, 'findById').mockResolvedValue({
    id: '1',
    role: 'admin',
  } as User);

  jest.spyOn(packagesRepository, 'insert').mockResolvedValue({
    id: '1',
  } as Package);

  const result = await usecase.execute({
    userId: '1',
    package: {
      name: 'name',
      description: 'description',
      price: 1,
    },
    details: [{
      description: 'detail',
    }],
  });

  expect(result).toEqual({
    package: {
      id: '1',
    },
  });

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith('1');

  expect(packagesRepository.insert).toHaveBeenCalledTimes(1);
  expect(packagesRepository.insert).toHaveBeenCalledWith({
    description: 'description',
    name: 'name',
    price: 1,
    details: [{
      description: 'detail',
    }],
  });
});