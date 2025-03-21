import { inject, singleton } from "tsyringe";
import { UseCase } from "../../../../core/UseCase";
import { Creative, CreativePaginationParams, FetchFacebookAdsInput } from "../../../../providers/facebook/@types/FacebookGraphApiAdsTypes";
import { FacebookGraphApiAds, facebookGraphApiAdsAlias } from "../../../../providers/facebook/FacebookGraphApiAds";
import { DomainError } from "../../../errors/DomainError";
import { UnauthorizedError } from "../../../errors/Unauthorized";
import { UsersRepository, usersRepositoryAlias } from "../../users/repositories/UsersRepository";

export type FetchCreativesUseCaseInput = {
  filters: FetchFacebookAdsInput['filters'];
  fields: FetchFacebookAdsInput['fields'];
  nextRequestUrl?: string;
  userId: string;
}

export type FetchCreativesUseCaseOutput = {
  creatives: Creative[];
  paging: CreativePaginationParams;
}

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
      fields: FacebookGraphApiAds.baseFieldsToFetchCreatives,
      nextRequestUrl: input.nextRequestUrl,
    }, { access_token: facebookAccount.accessToken! });

    if(adsResponse.status === 'SUCCESS') {
      return { 
        creatives: adsResponse.data!.ads, 
        paging: adsResponse.data!.paging
      };
    }
    
    if(adsResponse.status === 'UNAUTHORIZED') {
      throw new DomainError(400, 'INVALID_FACEBOOK_TOKEN');
    }

    throw new DomainError(400, 'ERROR_FETCHING_ADS');
  }
}