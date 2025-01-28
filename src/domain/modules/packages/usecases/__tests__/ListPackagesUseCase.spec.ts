import { find } from "../../../../../core/DependencyInjection";
import { Package } from "../../entities/Package";
import { PackagesRepository, packagesRepositoryAlias } from "../../repositories/PackagesRepository";
import { ListPackagesUseCase } from "../ListPackagesUseCase";

const usecase = find(ListPackagesUseCase);

const packagesRepo = find<PackagesRepository>(packagesRepositoryAlias);

it('should return packages', () => {
  const packages = [{ name: 'package1' }, { name: 'package2' }] as Package[];
  jest.spyOn(packagesRepo, 'list').mockResolvedValue(packages);

  expect(usecase.execute()).resolves.toEqual({ packages });
})