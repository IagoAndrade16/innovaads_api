import { inject, singleton } from "tsyringe";
import { UseCase } from "../../../../core/UseCase";
import { UserNotFoundError } from "../../../errors/UserNotFoundError";
import { FacebookCredential } from "../entities/FacebookCredential";
import { FacebookCredentialsRepository, facebookCredentialsRepositoryAlias } from "../repositories/FacebookCredetialsRepository";
import { UsersRepository, usersRepositoryAlias } from "../repositories/UsersRepository";
import { FacebookGraphApiAds, facebookGraphApiAdsAlias } from "../../../../providers/facebook/FacebookGraphApiAds";
import { DomainError } from "../../../errors/DomainError";

export type ConnectFacebookAccountUseCaseInput = {
  userId: string;
  userIdOnFacebook: string;
  accessToken: string;
  expiresIn: number;
}

export type ConnectFacebookAccountUseCaseOutput = {
  facebookCredential: FacebookCredential;
};

@singleton()
export class ConnectFacebookAccountUseCase implements UseCase<ConnectFacebookAccountUseCaseInput, ConnectFacebookAccountUseCaseOutput> {
  constructor(
    @inject(usersRepositoryAlias)
    private readonly usersRepository: UsersRepository,

    @inject(facebookCredentialsRepositoryAlias)
    private readonly facebookCredentialsRepository: FacebookCredentialsRepository,

    @inject(facebookGraphApiAdsAlias)
    private readonly facebookGraphApiAds: FacebookGraphApiAds,
  ) {}

  async execute(input: ConnectFacebookAccountUseCaseInput): Promise<ConnectFacebookAccountUseCaseOutput> {
    const user = await this.usersRepository.findById(input.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const getLongLivedAccessToken = await this.facebookGraphApiAds.getLongLivedAccessToken({
      access_token: input.accessToken,
    })

    if(getLongLivedAccessToken.status !== 'SUCCESS') {
      throw new DomainError(400, 'FAIL_TO_GENERATE_LONG_LIVED_ACCESS_TOKEN')
    }

    const longLivedAccessToken = getLongLivedAccessToken.data!;

    const expiresIn = FacebookCredential.generateExpirationDate(longLivedAccessToken.expires_in);
    const savedCredential = await this.facebookCredentialsRepository.save({
      accessToken: longLivedAccessToken.access_token,
      expiresIn,
      userId: input.userId,
      userIdOnFacebook: input.userIdOnFacebook,
    })

    return {
      facebookCredential: savedCredential,
    }
  }
}