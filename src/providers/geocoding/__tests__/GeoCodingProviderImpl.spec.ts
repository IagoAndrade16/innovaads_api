import { find } from "../../../core/DependencyInjection";
import { ApiProviderAxios, apiProviderAxiosAlias } from "../../api/ApiProviderAxios";
import { ApiResponse } from "../../api/implementations/ApiProviderAxiosImpl";
import { geoCodingAlias, GeoCodingProvider, GetRegionByCoordinatesOutput } from "../GeoCodingProvider";

const geoCodingProvider = find<GeoCodingProvider>(geoCodingAlias);
const apiProvider = find<ApiProviderAxios>(apiProviderAxiosAlias);

const getRegionByCoordinatesOutput = {
  statusCode: 200,
  data: {
    display_name: 'Display Name',
    address: {
      village: 'Village',
    }
  },
} as ApiResponse;

describe('getRegionByCoordinates', () => {
  it('should return a region by coordinates', async () => {
    jest.spyOn(apiProvider, 'get').mockResolvedValue(getRegionByCoordinatesOutput);

    const geoCodingRes = await geoCodingProvider.getRegionByCoordinates({ lat: 0, lon: 0 });

    expect(geoCodingRes).toEqual({
      status: 'SUCCESS',
      data: getRegionByCoordinatesOutput.data,
    } as GetRegionByCoordinatesOutput);

    expect(apiProvider.get).toHaveBeenCalledTimes(1);
    expect(apiProvider.get).toHaveBeenCalledWith(expect.stringContaining('lat=0&lon=0&format=json'), {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Innova Ads innovaads22@gmail.com'
    });
  });

  it('should return a bad request status', async () => {
    jest.spyOn(apiProvider, 'get').mockResolvedValue({
      ...getRegionByCoordinatesOutput,
      statusCode: 400,
    });

    const geoCodingRes = await geoCodingProvider.getRegionByCoordinates({ lat: 0, lon: 0 });

    expect(geoCodingRes).toEqual({
      status: 'BAD_REQUEST',
      data: null,
    } as GetRegionByCoordinatesOutput);

    expect(apiProvider.get).toHaveBeenCalledTimes(1);
    expect(apiProvider.get).toHaveBeenCalledWith(expect.stringContaining('lat=0&lon=0&format=json'), {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Innova Ads innovaads22@gmail.com'
    });
  }); 
});