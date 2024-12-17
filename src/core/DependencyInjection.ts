import { container, InjectionToken } from "tsyringe";
import { UsersRepository, usersRepositoryAlias } from "../domain/users/repositories/UsersRepository";
import { UsersRepositoryTypeOrm } from "../domain/users/repositories/implementations/UsersRepositoryTypeOrm";
import { HashProvider, hashProviderAlias } from "../providers/hash/HashProvider";
import { HashProviderImpl } from "../providers/hash/implementations/HashProviderImpl";
import { JwtProvider, jwtProviderAlias } from "../providers/jwt/JwtProvider";
import { JwtProviderImpl } from "../providers/jwt/implementations/JwtProviderImpl";
import { ApiProviderAxios, apiProviderAxiosAlias } from "../providers/api/ApiProviderAxios";
import { ApiProviderAxiosImpl } from "../providers/api/implementations/ApiProviderAxiosImpl";
import { EmailSenderProvider, emailSenderProviderAlias } from "../providers/mail/EmailSenderProvider";
import { EmailSenderProviderImpl } from "../providers/mail/implementations/EmailSenderProviderImpl";
import { TemplaterProvider, templaterProviderAlias } from "../providers/templater/TemplaterProvider";
import { TemplaterHandlebarsImpl } from "../providers/templater/implementations/TemplaterHandlebarsImpl";

export class DependencyInjection {
  static init(): void {
    container.registerSingleton<UsersRepository>(usersRepositoryAlias, UsersRepositoryTypeOrm);
    container.registerSingleton<HashProvider>(hashProviderAlias, HashProviderImpl);
    container.registerSingleton<JwtProvider>(jwtProviderAlias, JwtProviderImpl);
    container.registerSingleton<ApiProviderAxios>(apiProviderAxiosAlias, ApiProviderAxiosImpl);
    container.registerSingleton<EmailSenderProvider>(emailSenderProviderAlias, EmailSenderProviderImpl);
    container.registerSingleton<TemplaterProvider>(templaterProviderAlias, TemplaterHandlebarsImpl)
  }
}

export function find<T>(token: InjectionToken<T>): T {
	return container.resolve(token);
}