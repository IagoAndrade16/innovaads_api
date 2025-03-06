import { JsObject } from "../../@types/JsObject";
import { find } from "../../core/DependencyInjection";
import { ApiProviderAxios, apiProviderAxiosAlias } from "../api/ApiProviderAxios";
import { ApiResponse } from "../api/implementations/ApiProviderAxiosImpl";
import { GetAuthTokenRequest, GetAuthTokenResponse } from "./@types/GoogleAuthProviderTypes";

export abstract class GoogleAuthProvider {

  protected abstract buildUrl(endpoint: string, data?: JsObject): string;
  protected abstract headers(): JsObject;

  abstract getAuthToken(data: GetAuthTokenRequest): Promise<GetAuthTokenResponse>;

  protected async post(endpoint: string, data: JsObject): Promise<ApiResponse> {
    const apiProvider = find<ApiProviderAxios>(apiProviderAxiosAlias);

    const res = await apiProvider.post(
      this.buildUrl(endpoint),
      new URLSearchParams(data),
      this.headers()
    );

    return res;
  } 

  protected async get(endpoint: string, data: JsObject): Promise<ApiResponse> {
    const apiProvider = find<ApiProviderAxios>(apiProviderAxiosAlias);

    const res = await apiProvider.get(
      this.buildUrl(endpoint, data),
      this.headers()
    );

    return res;
  }
}
  
export const googleAuthProviderAlias = 'GoogleAuthProvider';