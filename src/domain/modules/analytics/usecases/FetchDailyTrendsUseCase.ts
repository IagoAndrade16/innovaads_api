import { inject, singleton } from "tsyringe";
import { UseCase } from "../../../../core/UseCase";
import { TrendsProvider, trendsProviderAlias } from "../../../../providers/trends/TrendsProvider";

import { FetchDailyTrendsOutput } from "../../../../providers/trends/dtos/dailyTrendsDTO";
import { UsersRepository, usersRepositoryAlias } from "../../users/repositories/UsersRepository";
import { UserNotFound } from "../../../errors/UserNotFound";
import { UniqueEntityID } from "../../../entities/UniqueEntityID";

export type FetchDailyTrendsUseCaseInput = {
  userId: UniqueEntityID;
  geoLocation: string;
  trendsDate?: string;
}

export type FetchDailyTrendsUseCaseOutput = FetchDailyTrendsOutput;

@singleton()
export class FetchDailyTrendsUseCase implements UseCase<FetchDailyTrendsUseCaseInput, FetchDailyTrendsUseCaseOutput> {
  constructor (
    @inject(usersRepositoryAlias)
    private readonly usersRepository: UsersRepository,

    @inject(trendsProviderAlias)
    private readonly trendsProvider: TrendsProvider,
  ) {}

  async execute(input: FetchDailyTrendsUseCaseInput): Promise<FetchDailyTrendsUseCaseOutput> {
    const user = await this.usersRepository.findById(input.userId);
    
    if (!user) {
      throw new UserNotFound();
    }

    const dailyTrends = await this.trendsProvider.fetchDailyTrends({
      geo: input.geoLocation,
      trendDate: input.trendsDate ? new Date(input.trendsDate) : new Date(),
    });

    return dailyTrends;
  }
}