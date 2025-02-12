import { inject, singleton } from "tsyringe";
import { UseCase } from "../../../../core/UseCase";
import { UsersRepository, usersRepositoryAlias } from "../../users/repositories/UsersRepository";
import { TrendsProvider, trendsProviderAlias } from "../../../../providers/trends/TrendsProvider";
import { UserNotFoundError } from "../../../errors/UserNotFoundError";
import { ResolutionInterestByRegion } from "../../../../providers/trends/dtos/interestByRegionDTO";
import { geoCodingAlias, GeoCodingProvider } from "../../../../providers/geocoding/GeoCodingProvider";
import { MomentUtils } from "../../../../core/MomentUtils";

export type MostInterestedRegionsUseCaseInput = {
  userId: string;
  keyword: string;
  startDate?: string;
  endDate?: string;
}

export type MostInterestedRegionsUseCaseOutput = {
  lat: number;
  lng: number;
  intesity: number;
  city: string;
};

@singleton()
export class MostInterestedRegionsUseCase implements UseCase<MostInterestedRegionsUseCaseInput, MostInterestedRegionsUseCaseOutput[]> {
  constructor (
    @inject(usersRepositoryAlias)
    private readonly usersRepository: UsersRepository,

    @inject(trendsProviderAlias)
    private readonly trendsProvider: TrendsProvider,

    @inject(geoCodingAlias)
    private readonly geoCodingProvider: GeoCodingProvider,
  ) {}

  async execute(input: MostInterestedRegionsUseCaseInput): Promise<MostInterestedRegionsUseCaseOutput[]> {
    const user = await this.usersRepository.findById(input.userId);

    if (!user) {
      throw new UserNotFoundError();
    }
    
    const interestByRegionRes = await this.trendsProvider.interestByRegion({
      keyword: [input.keyword],
      geo: ['BR'],
      startTime: input.startDate ? new Date(input.startDate) : MomentUtils.subtractMonths(new Date(), 12),
      endTime: input.endDate ? new Date(input.endDate) : undefined,
      resolution: ResolutionInterestByRegion.CITY,
    });
    
    const interestByRegionSortedByValue = interestByRegionRes.default.geoMapData.sort((a, b) => {
      return b.value[0] - a.value[0];
    }).slice(0, 20);
    
    const mostInterestedRegionFormated = await Promise.all(
      interestByRegionSortedByValue.map(async (region) => {
        return {
          lat: region.coordinates!.lat,
          lng: region.coordinates!.lng,
          intesity: region.value[0],
          city: region.geoName,
        };
      })
    );
    
    return mostInterestedRegionFormated;
  }
}