import { FetchDailyTrendsInput, FetchDailyTrendsOutput } from "./dtos/dailyTrendsDTO";
import { InterestByRegionInput, InterestByRegionOutput } from "./dtos/interestByRegionDTO";
import { FetchInterestOverTimeInput, FetchInterestOverTimeOutput } from "./dtos/interestOverTimeTrendsDTO";
import { RelatedQueriesInput, RelatedQueriesOutput } from "./dtos/relatedQueriesDTO";

export type TrendsProvider = {
  fetchDailyTrends(input: FetchDailyTrendsInput): Promise<FetchDailyTrendsOutput>;
  fetchInterestOverTime(input: FetchInterestOverTimeInput): Promise<FetchInterestOverTimeOutput>;
  interestByRegion(input: InterestByRegionInput): Promise<InterestByRegionOutput>;
  relatedQueries(input: RelatedQueriesInput): Promise<RelatedQueriesOutput>;
}

export const trendsProviderAlias = 'TrendsProvider';