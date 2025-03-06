import { inject, injectable } from "tsyringe";
import { GoogleAdsApiProvider } from "../GoogleAdsApiProvider";
import { ApiProviderAxios, apiProviderAxiosAlias } from "../../api/ApiProviderAxios";
import { JsObject } from "../../../@types/JsObject";
import { ApiResponse } from "../../api/implementations/ApiProviderAxiosImpl";


@injectable()
export class GoogleAdsApiProviderImpl implements GoogleAdsApiProvider {
  constructor(
    @inject(apiProviderAxiosAlias)
    private apiProvider: ApiProviderAxios,
  ) {}

  async keywordPlanner(): Promise<void> {

  }

  private async post(url: string, data: JsObject): Promise<ApiResponse> {
    const res = await this.apiProvider.post(url, {
      ...data,
    });

    return res;
  }

  private async get(url: string): Promise<ApiResponse> {
    const res = await this.apiProvider.get(url);

    return res;
  }
}