import { JsObject } from "../../@types/JsObject";
import { ApiProviderAxios } from "../api/ApiProviderAxios";
import { ApiResponse } from "../api/implementations/ApiProviderAxiosImpl";
import { GraphApiObject } from "./@types/FacebookGraphApiTypes";

export abstract class FacebookGraphApi {
  constructor(
    public readonly apiProvider: ApiProviderAxios,
  ) {}

  protected abstract buildUrl(endpoint: string, data?: GraphApiObject): string;
  protected abstract headers(): JsObject;

  protected async post(endpoint: string, data: JsObject): Promise<ApiResponse> {
    const res = await this.apiProvider.post(
      this.buildUrl(endpoint),
      data,
      this.headers()
    );

    return res;
  } 

  protected async get(endpoint: string, data: GraphApiObject): Promise<ApiResponse> {
    const res = await this.apiProvider.get(
      this.buildUrl(endpoint, data),
      this.headers()
    );

    return res;
  }

  protected async httpDelete(endpoint: string, data: GraphApiObject): Promise<ApiResponse> {
    const res = await this.apiProvider.delete(
      this.buildUrl(endpoint),
      data,
      this.headers()
    );

    return res;
  }
}

export const facebookGraphApiAlias = 'FacebookGraphApi';