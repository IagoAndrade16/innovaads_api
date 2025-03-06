import { JsObject } from "../../@types/JsObject";
import { ApiProviderAxios } from "../api/ApiProviderAxios";
import { ApiResponse } from "../api/implementations/ApiProviderAxiosImpl";
import { GraphApiObject } from "./@types/FacebookGraphApiTypes";
import { FacebookGraphApiAdsAuthorization } from "./FacebookGraphApiAds";

export abstract class FacebookGraphApi {
  constructor(
    public readonly apiProvider: ApiProviderAxios,
  ) {}

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
      this.buildUrl(endpoint, auth),
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

export const facebookGraphApiAlias = 'FacebookGraphApi';