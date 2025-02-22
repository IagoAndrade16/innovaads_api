import { container, InjectionToken } from "tsyringe";
import { UsersRepository, usersRepositoryAlias } from "../domain/modules/users/repositories/UsersRepository";
import { UsersRepositoryTypeOrm } from "../infra/database/typeorm/repositories/users/UsersRepositoryTypeOrm";
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
import { Users2FARepository, users2FARepositoryAlias } from "../domain/modules/users/repositories/Users2FARepository";
import { Users2FARepositoryTypeOrm } from "../infra/database/typeorm/repositories/users/Users2FARepositoryTypeOrm";
import { RandomProvider, randomProviderAlias } from "../providers/random/RandomProvider";
import { RandomProviderImpl } from "../providers/random/implementations/RandomProviderImpl";
import { TrendsProvider, trendsProviderAlias } from "../providers/trends/TrendsProvider";
import { TrendsProviderImpl } from "../providers/trends/implementations/TrendsProviderImpl";
import { geoCodingAlias, GeoCodingProvider } from "../providers/geocoding/GeoCodingProvider";
import { GeoCodingProviderImpl } from "../providers/geocoding/implementations/GeoCodingProviderImpl";
import { PackageDetailsRepository, packageDetailsRepositoryAlias } from "../domain/modules/packages/repositories/PackageDetailsRepository";
import { PackageDetailsRespositoryTypeOrm } from "../infra/database/typeorm/repositories/packages/PackageDetailsRepositoryTypeOrm";
import { PackagesRepository, packagesRepositoryAlias } from "../domain/modules/packages/repositories/PackagesRepository";
import { PackagesRespositoryTypeOrm } from "../infra/database/typeorm/repositories/packages/PackagesRepositoryTypeOrm";
import { PagarmeProvider, pagarmeProviderAlias } from "../providers/pagarme/PagarmeProvider";
import { PagarmeProviderImpl } from "../providers/pagarme/implementations/PagarmeProviderImpl";
import { usersForgotPassword2FARepositoryAlias, UsersForgotPassword2FARepository } from "../domain/modules/users/repositories/UsersForgotPassword2FARepository";
import { UsersForgotPassword2FARepositoryTypeOrm } from "../infra/database/typeorm/repositories/users/UsersForgotPassword2FARepositoryTypeOrm";
import { SubscriptionsRepository, subscriptionsRepositoryAlias } from "../domain/modules/subscriptions/repositories/SubscriptionsRepository";
import { SubscriptionsRepositoryTypeOrm } from "../infra/database/typeorm/repositories/subscriptions/SubscriptionsRepositoryTypeOrm";
import { AdsProvider, adsProviderAlias } from "../providers/ads/AdsProvider";
import { AdsProviderImpl } from "../providers/ads/implementations/AdsLibraryProviderImpl";


export class DependencyInjection {
  static init(): void {
    container.registerSingleton<UsersRepository>(usersRepositoryAlias, UsersRepositoryTypeOrm);
    container.registerSingleton<HashProvider>(hashProviderAlias, HashProviderImpl);
    container.registerSingleton<JwtProvider>(jwtProviderAlias, JwtProviderImpl);
    container.registerSingleton<ApiProviderAxios>(apiProviderAxiosAlias, ApiProviderAxiosImpl);
    container.registerSingleton<EmailSenderProvider>(emailSenderProviderAlias, EmailSenderProviderImpl);
    container.registerSingleton<TemplaterProvider>(templaterProviderAlias, TemplaterHandlebarsImpl);
    container.registerSingleton<Users2FARepository>(users2FARepositoryAlias, Users2FARepositoryTypeOrm);
    container.registerSingleton<RandomProvider>(randomProviderAlias, RandomProviderImpl);
    container.registerSingleton<TrendsProvider>(trendsProviderAlias, TrendsProviderImpl);
    container.registerSingleton<GeoCodingProvider>(geoCodingAlias, GeoCodingProviderImpl);
    container.registerSingleton<PackagesRepository>(packagesRepositoryAlias, PackagesRespositoryTypeOrm);
    container.registerSingleton<PackageDetailsRepository>(packageDetailsRepositoryAlias, PackageDetailsRespositoryTypeOrm);
    container.registerSingleton<HashProvider>(hashProviderAlias, HashProviderImpl);
    container.registerSingleton<PagarmeProvider>(pagarmeProviderAlias, PagarmeProviderImpl);
    container.registerSingleton<UsersForgotPassword2FARepository>(usersForgotPassword2FARepositoryAlias, UsersForgotPassword2FARepositoryTypeOrm);
    container.registerSingleton<SubscriptionsRepository>(subscriptionsRepositoryAlias, SubscriptionsRepositoryTypeOrm);
    container.registerSingleton<AdsProvider>(adsProviderAlias, AdsProviderImpl);
  }
}

export function find<T>(token: InjectionToken<T>): T {
	return container.resolve(token);
}