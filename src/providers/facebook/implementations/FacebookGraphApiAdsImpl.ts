import { injectable } from "tsyringe";
import { urlJoin } from "url-join-ts";
import { JsObject } from "../../../@types/JsObject";
import { Environment } from "../../../core/Enviroment";
import { Utils } from "../../../core/Utils";
import { GraphApiObject } from "../@types/FacebookGraphApiTypes";
import { FacebookGraphApiAds } from "../FacebookGraphApiAds";

@injectable()
export class FacebookGraphApiAdsImpl extends FacebookGraphApiAds {
  public buildUrl(endpoint: string, data?: GraphApiObject): string {
    const params = {
      ...data,
      access_token: Environment.vars.FACEBOOK_ACCESS_TOKEN,
    }

    const queryParams = Utils.buildQueryParams(params.filters);
    return urlJoin(Environment.vars.FACEBOOK_GRAPH_API_URL, endpoint, queryParams);
  }

  public headers(): JsObject {
    return {}
  }
}