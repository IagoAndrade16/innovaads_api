import { JsObject } from "../../@types/JsObject";
import { ApiProviderAxios } from "../api/ApiProviderAxios";
import { ApiResponse } from "../api/implementations/ApiProviderAxiosImpl";
import { FetchFacebookAdsInput, FetchFacebookAdsOutput } from "./@types/FacebookGraphApiAdsTypes";
import { GetLongLivedAccessTokenInput, GetLongLivedAccessTokenOutput, GraphApiObject } from "./@types/FacebookGraphApiTypes";

export abstract class FacebookGraphApiAds {
  constructor(
    public readonly apiProvider: ApiProviderAxios,
  ) {}

  static baseFieldsToFetchCreatives: FetchFacebookAdsInput['fields'] = {
    ad_creation_time: true,
    ad_creative_bodies: true,
    ad_creative_link_captions: true,
    ad_creative_link_descriptions: true,
    ad_creative_link_titles: true,
    ad_delivery_start_time: true,
    ad_delivery_stop_time: true,
    ad_snapshot_url: true,
  };

  abstract fetchCreatives(options: FetchFacebookAdsInput, auth: FacebookGraphApiAdsAuthorization): Promise<FetchFacebookAdsOutput>;
  abstract getLongLivedAccessToken(input: GetLongLivedAccessTokenInput): Promise<GetLongLivedAccessTokenOutput>;

  protected abstract buildUrl(endpoint: string, auth: FacebookGraphApiAdsAuthorization, data?: GraphApiObject): string;
  protected abstract headers(): JsObject;

  protected async post(endpoint: string, data: GraphApiObject, auth: FacebookGraphApiAdsAuthorization): Promise<ApiResponse> {
    const res = await this.apiProvider.post(
      this.buildUrl(endpoint, auth, data),
      data,
      this.headers()
    );

    return res;
  } 

  protected async get(endpoint: string, data: GraphApiObject, auth: FacebookGraphApiAdsAuthorization): Promise<ApiResponse> {
    const res = await this.apiProvider.get(
      this.buildUrl(endpoint, auth , data),
      this.headers()
    );

    return res;
  }

  protected async httpDelete(endpoint: string, data: GraphApiObject, auth: FacebookGraphApiAdsAuthorization): Promise<ApiResponse> {
    const res = await this.apiProvider.delete(
      this.buildUrl(endpoint, auth, data),
      data,
      this.headers()
    );

    return res;
  }
}

export type FacebookGraphApiAdsAuthorization = {
  access_token: string;
}

export const facebookGraphApiAdsAlias = 'FacebookGraphApiAds';