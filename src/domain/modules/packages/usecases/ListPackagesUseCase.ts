import { inject, singleton } from "tsyringe";
import { UseCase } from "../../../../core/UseCase";
import { PackagesRepository, packagesRepositoryAlias } from "../repositories/PackagesRepository";
import { Package } from "../entities/Package";


export type ListPackagesUseCaseOutput = {
  packages: Package[];
};

@singleton()
export class ListPackagesUseCase implements UseCase<void, ListPackagesUseCaseOutput> {
  constructor (
    @inject(packagesRepositoryAlias)
    private readonly packagesRepository: PackagesRepository,
  ) {}

  async execute(): Promise<ListPackagesUseCaseOutput> {
    const packages = await this.packagesRepository.list({});

    return {
      packages
    }
  }
}