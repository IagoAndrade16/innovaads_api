import { injectable } from "tsyringe";
import { urlJoin } from "url-join-ts";
import { JsObject } from "../../../@types/JsObject";
import { Environment } from "../../../core/Enviroment";
import { Utils } from "../../../core/Utils";
import { GraphApiObject } from "../@types/FacebookGraphApiTypes";
import { FacebookGraphApiAds, FacebookGraphApiAdsAuthorization } from "../FacebookGraphApiAds";
import { FetchFacebookAdsInput, FetchFacebookAdsOutput } from "../@types/FacebookGraphApiAdsTypes";

@injectable()
export class FacebookGraphApiAdsImpl extends FacebookGraphApiAds {

  async fetchCreatives(options: FetchFacebookAdsInput, auth: FacebookGraphApiAdsAuthorization): Promise<FetchFacebookAdsOutput> {
    const url = this.buildUrl("ads_archive", auth, options);
    const response = await this.get(url, options, auth);
    
    return {
      ads: response.data,
    };
  }

  public buildUrl(endpoint: string, auth: FacebookGraphApiAdsAuthorization, data?: GraphApiObject): string {
    const params = {
      ...data,
      access_token: auth.access_token,
    }

    const queryParams = Utils.buildQueryParams(params.filters);
    return urlJoin(Environment.vars.FACEBOOK_GRAPH_API_URL, endpoint, queryParams);
  }

  public headers(): JsObject {
    return {}
  }
}