import { FetchFacebookAdsInput, FetchFacebookAdsOutput } from "./@types/FacebookGraphApiAdsTypes";
import { FacebookGraphApi } from "./FacebookGraphApi";

export abstract class FacebookGraphApiAds extends FacebookGraphApi {
  abstract fetchCreatives(options: FetchFacebookAdsInput, auth: FacebookGraphApiAdsAuthorization): Promise<FetchFacebookAdsOutput>;
}

export type FacebookGraphApiAdsAuthorization = {
  access_token: string;
}

export const facebookGraphApiAdsAlias = 'FacebookGraphApiAds';