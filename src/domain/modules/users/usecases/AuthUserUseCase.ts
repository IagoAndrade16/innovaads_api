import { inject, singleton } from "tsyringe";
import { UseCase } from "../../../../core/UseCase";
import { UnauthorizedError } from "../../../errors/Unauthorized";
import { HashProvider, hashProviderAlias } from "../../../../providers/hash/HashProvider";
import { User, UserSubscriptionStatus } from "../entities/User";
import { UsersRepository, usersRepositoryAlias } from "../repositories/UsersRepository";

export type AuthUserUseCaseInput = {
  email: string;
  password: string;
}

export type AuthUserUseCaseOutput = {
  auth: AuthUserUseCaseAuthData;
  name: string;
  email: string;
  phone: string;
  isOnTrial: boolean;
  packageId: string | null;
  verified2fa: boolean;
  subscriptionStatus: UserSubscriptionStatus | null;
  canUsePlatformUntil: Date | null;
  facebookAccount: AuthUserUseCaseFacebookAccount | null;
  daysRemainingForTrial?: number;
}

type AuthUserUseCaseAuthData = {
  token: string;
}

type AuthUserUseCaseFacebookAccount = {
  userIdOnFacebook: string | null;
  expiresIn: Date | null;
}

@singleton()
export class AuthUserUseCase implements UseCase<AuthUserUseCaseInput, AuthUserUseCaseOutput> {
  constructor(
    @inject(usersRepositoryAlias)
    private readonly usersRepository: UsersRepository,

    @inject(hashProviderAlias)
    private readonly hashProvider: HashProvider,
  ) {}

  async execute(input: AuthUserUseCaseInput): Promise<AuthUserUseCaseOutput> {
    const user = await this.usersRepository.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedError('INVALID_CREDENTIALS');
    }

    const passwordMatch = await this.hashProvider.compareHash(input.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedError('INVALID_CREDENTIALS');
    }

    const token = await User.generateUserToken({ id: user.id });

    return {
      auth: {
        token,
      },
      name: user.name,
      email: user.email,
      phone: user.phone,
      isOnTrial: user.isOnTrial,
      daysRemainingForTrial: user.daysRemainingForTrial,
      packageId: user.packageId,
      verified2fa: user.verified2fa,
      subscriptionStatus: user.subscriptionStatus,
      canUsePlatformUntil: await user.canUsePlatformUntil(),
      facebookAccount: user.facebookCredential ? {
        userIdOnFacebook: user.facebookCredential?.userIdOnFacebook,
        expiresIn: user.facebookCredential?.expiresIn,
      } : null,
    }
  }
}