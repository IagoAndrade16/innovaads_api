import { inject, injectable } from "tsyringe";
import { JsObject } from "../../../@types/JsObject";
import { Environment } from "../../../core/Enviroment";
import { Utils } from "../../../core/Utils";
import { ApiProviderAxios, apiProviderAxiosAlias } from "../../api/ApiProviderAxios";
import { FetchFacebookAdsInput, FetchFacebookAdsOutput, HandleErrorResponse } from "../@types/FacebookGraphApiAdsTypes";
import { GetLongLivedAccessTokenInput, GetLongLivedAccessTokenOutput, GraphApiObject } from "../@types/FacebookGraphApiTypes";
import { FacebookGraphApiAds, FacebookGraphApiAdsAuthorization } from "../FacebookGraphApiAds";
import { urlJoin } from "url-join-ts";
import { ApiResponse } from "../../api/implementations/ApiProviderAxiosImpl";

@injectable()
export class FacebookGraphApiAdsImpl extends FacebookGraphApiAds {
  constructor(
    @inject(apiProviderAxiosAlias)
    public readonly apiProvider: ApiProviderAxios,
  ) {
    super(apiProvider);
  }

  async fetchCreatives(options: FetchFacebookAdsInput, auth: FacebookGraphApiAdsAuthorization): Promise<FetchFacebookAdsOutput> {
    if(options.nextRequestUrl) {
      return this.httpGetWithFullUrl(options.nextRequestUrl);
    }

    const buildedEnpoint = this.buildGraphApiUrl("ads_archive", auth, options);

    const response = await this.get(buildedEnpoint, options, auth);

    if(response.statusCode === 200) {
      return {
        status: 'SUCCESS',
        data: {
          ads: response.data.data,
          paging: response.data.paging,
        },
      };
    }

    return this.handleErrorResponse(response);
  }

  async getLongLivedAccessToken(input: GetLongLivedAccessTokenInput): Promise<GetLongLivedAccessTokenOutput> {
    const params = {
      grant_type: 'fb_exchange_token',
      client_id: Environment.vars.FACEBOOK_APP_ID,
      client_secret: Environment.vars.FACEBOOK_APP_SECRET,
      fb_exchange_token: input.access_token,
    };

    const buildedEnpoint = Utils.buildQueryParams(params);
    const url = this.buildUrl(`oauth/access_token${buildedEnpoint}`);

    const response = await this.apiProvider.get(url, this.headers());

    if(response.statusCode === 200) {
      return {
        status: 'SUCCESS',
        data: {
          access_token: response.data.access_token,
          token_type: response.data.token_type,
          expires_in: response.data.expires_in,
        },
      };
    }

    return this.handleErrorResponse(response);
  }

  public buildUrl(endpoint: string): string {
    return urlJoin(Environment.vars.FACEBOOK_GRAPH_API_URL, endpoint);
  }

  public headers(): JsObject {
    return {}
  }

  private async httpGetWithFullUrl(url: string): Promise<FetchFacebookAdsOutput> {
    const response = await this.apiProvider.get(url, this.headers());

    if(response.statusCode === 200) {
      return {
        status: 'SUCCESS',
        data: {
          ads: response.data.data,
          paging: response.data.paging,
        },
      };
    }

    return this.handleErrorResponse(response);
  }

  private buildGraphApiUrl(endpoint: string, auth: FacebookGraphApiAdsAuthorization, data?: GraphApiObject) {
    const params = {
      ...data?.filters,
      ...auth,
      fields: this.buildFieldsToQuery(data?.fields),
    }

    const queryParams = Utils.buildQueryParams(params);
    return urlJoin(endpoint, queryParams);
  }

  private buildFieldsToQuery(data?: FetchFacebookAdsInput['fields']): string {
    if(!data) {
      return '';
    }

    const fields = Object.entries(data).filter(([, value]) => value === true).map(([key]) => key);
    return fields.join(',');
  }

  private handleErrorResponse(response: ApiResponse): HandleErrorResponse {
    if (response.statusCode === 400) {
      if (response.data.error && response.data.error.code === 190) {
        return {
          status: 'UNAUTHORIZED',
        };
      }

      return {
        status: 'BAD_REQUEST',
      };
    }

    return {
      status: 'ERROR',
    };
  }
}