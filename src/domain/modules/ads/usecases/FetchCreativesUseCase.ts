import { inject, singleton } from "tsyringe";
import { UseCase } from "../../../../core/UseCase";
import { UnauthorizedError } from "../../../errors/Unauthorized";
import { UsersRepository, usersRepositoryAlias } from "../../users/repositories/UsersRepository";
import { FacebookGraphApiAds, facebookGraphApiAdsAlias } from "../../../../providers/facebook/FacebookGraphApiAds";
import { FetchFacebookAdsInput, FetchFacebookAdsOutput } from "../../../../providers/facebook/@types/FacebookGraphApiAdsTypes";

export type FetchCreativesUseCaseInput = {
  filters: FetchFacebookAdsInput['filters'];
  fields: FetchFacebookAdsInput['fields'];
  userId: string;
}

export type FetchCreativesUseCaseOutput = {
  creatives: FetchFacebookAdsOutput['ads'];
}

// TODO: unit tests
@singleton()
export class FetchCreativesUseCase implements UseCase<FetchCreativesUseCaseInput, FetchCreativesUseCaseOutput> {
  constructor(
    @inject(usersRepositoryAlias)
    private readonly usersRepository: UsersRepository,

    @inject(facebookGraphApiAdsAlias)
    private readonly facebookGraphApiAds: FacebookGraphApiAds,
  ) {}

  async execute(input: FetchCreativesUseCaseInput): Promise<FetchCreativesUseCaseOutput> {
    const user = await this.usersRepository.findById(input.userId);

    if (!user) {
      throw new UnauthorizedError('INVALID_CREDENTIALS');
    }

    const facebookAccount = user.facebookCredential;

    if (!facebookAccount) {
      throw new UnauthorizedError('NO_FACEBOOK_ACCOUNT_FOUND');
    }

    const adsResponse = await this.facebookGraphApiAds.fetchCreatives({
      filters: input.filters,
      fields: input.fields,
    }, { access_token: facebookAccount.accessToken! });

    return { creatives: adsResponse.ads }
  }
}