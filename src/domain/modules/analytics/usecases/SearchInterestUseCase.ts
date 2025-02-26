import { inject, singleton } from "tsyringe";
import { UseCase } from "../../../../core/UseCase";
import { TrendsProvider, trendsProviderAlias } from "../../../../providers/trends/TrendsProvider";
import { UsersRepository, usersRepositoryAlias } from "../../users/repositories/UsersRepository";

import { FetchInterestOverTimeOutput } from "../../../../providers/trends/dtos/interestOverTimeTrendsDTO";
import { DateUtils } from "../../../../core/DateUtils";
import { UserNotFoundError } from "../../../errors/UserNotFoundError";

export type SearchInterestUseCaseInput = {
  keyword: string;
  userId: string;
  startDate?: string;
  endDate?: string;
}

export type SearchInterestUseCaseOutput = FetchInterestOverTimeOutput;

@singleton()
export class SearchInterestUseCase implements UseCase<SearchInterestUseCaseInput, SearchInterestUseCaseOutput> {
  constructor (
    @inject(usersRepositoryAlias)
    private readonly usersRepository: UsersRepository,

    @inject(trendsProviderAlias)
    private readonly trendsProvider: TrendsProvider,
  ) {}

  async execute(input: SearchInterestUseCaseInput): Promise<SearchInterestUseCaseOutput> {
    const user = await this.usersRepository.findById(input.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const trendsInterestByKeyword = await this.trendsProvider.fetchInterestOverTime({
      keyword: [input.keyword],
      geo: ['BR'],
      startTime: input.startDate ? new Date(input.startDate) : DateUtils.subtractMonths(new Date(), 12),
      endTime: input.endDate ? new Date(input.endDate) : undefined,
    });

    return trendsInterestByKeyword;
  }
}