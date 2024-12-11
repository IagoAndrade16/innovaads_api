import { container, InjectionToken } from "tsyringe";
import { UsersRepository, usersRepositoryAlias } from "../domain/users/repositories/UsersRepository";
import { UsersRepositoryTypeOrm } from "../domain/users/repositories/implementations/UsersRepositoryTypeOrm";
import { HashProvider, hashProviderAlias } from "../providers/hash/HashProvider";
import { HashProviderImpl } from "../providers/hash/implementations/HashProviderImpl";

export class DependencyInjection {
  static init(): void {
    container.registerSingleton<UsersRepository>(usersRepositoryAlias, UsersRepositoryTypeOrm);
    container.registerSingleton<HashProvider>(hashProviderAlias, HashProviderImpl);
  }
}

export function find<T>(token: InjectionToken<T>): T {
	return container.resolve(token);
}