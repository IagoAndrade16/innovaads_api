import { inject, injectable } from "tsyringe";
import { JsObject } from "../../../@types/JsObject";
import { Environment } from "../../../core/Enviroment";
import { Utils } from "../../../core/Utils";
import { GeoCodingProvider, GetRegionByCoordinatesInput, GetRegionByCoordinatesOutput } from "../GeoCodingProvider";
import { ApiProviderAxios, apiProviderAxiosAlias } from "../../api/ApiProviderAxios";
import { ApiResponse } from "../../api/implementations/ApiProviderAxiosImpl";

@injectable()
export class GeoCodingProviderImpl implements GeoCodingProvider {
  constructor(
    @inject(apiProviderAxiosAlias)
    private readonly apiProvider: ApiProviderAxios,
  ) {}

  async getRegionByCoordinates(input: GetRegionByCoordinatesInput): Promise<GetRegionByCoordinatesOutput> {
    const geocodingRes = await this.get<ApiResponse>({
      lat: input.lat,
      lon: input.lon,
      format: 'json',
    });    

    if (geocodingRes.statusCode === 200) {
      return {
        status: 'SUCCESS',
        data: geocodingRes.data,
      } as GetRegionByCoordinatesOutput;
    }

    return {
      status: 'BAD_REQUEST',
      data: null,
    } as GetRegionByCoordinatesOutput;
  }

  private async post<Res>(data: JsObject): Promise<Res> {
    const res = await this.apiProvider.post(
      this.buildUrl(),
      data,
      this.headers()
    );

    return res as Res;
  } 

  private async get<Res>(data?: JsObject): Promise<Res> {
    const res = await this.apiProvider.get(
      this.buildUrl(data),
      this.headers()
    );

    return res as Res;
  }

  private buildUrl(data?: JsObject): string {
    let queryParams = '';
    if (data) queryParams = Utils.buildQueryParams(data);
    return `${Environment.vars.GEOCODING_API_URL}${!queryParams ? '' : `?${queryParams}`}`;
  }

  private headers(): JsObject {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Innova Ads innovaads22@gmail.com'
    }
  }
}