import googleTrends from 'google-trends-api';

import { FetchDailyTrendsInput, FetchDailyTrendsOutput } from "../dtos/dailyTrendsDTO";
import { TrendsProvider } from "../TrendsProvider";
import { FetchInterestOverTimeInput, FetchInterestOverTimeOutput } from '../dtos/interestOverTimeTrendsDTO';
import { InterestByRegionInput, InterestByRegionOutput } from '../dtos/interestByRegionDTO';
import { RelatedQueriesInput, RelatedQueriesOutput } from '../dtos/relatedQueriesDTO';

export class TrendsProviderImpl implements TrendsProvider {
  async fetchDailyTrends(input: FetchDailyTrendsInput): Promise<FetchDailyTrendsOutput> {
    const dailyTrendsRes = await googleTrends.dailyTrends({
      geo: input.geo,
      hl: input.hl,
      timezone: input.timezone,
      trendDate: input.trendDate,
    });

    return JSON.parse(dailyTrendsRes);
  }

  async fetchInterestOverTime(input: FetchInterestOverTimeInput): Promise<FetchInterestOverTimeOutput> {
    const interestOverTimeRes = await googleTrends.interestOverTime({
      keyword: input.keyword,
      startTime: input.startTime,
      endTime: input.endTime,
      geo: input.geo,
      hl: input.hl,
      timezone: input.timezone,
      category: input.category,
    });

    return JSON.parse(interestOverTimeRes);
  }

  async interestByRegion(input: InterestByRegionInput): Promise<InterestByRegionOutput> {
    const interestByRegionRes = await googleTrends.interestByRegion({
      keyword: input.keyword,
      startTime: input.startTime,
      endTime: input.endTime,
      geo: input.geo,
      hl: input.hl,
      timezone: input.timezone,
      category: input.category,
    });

    return JSON.parse(interestByRegionRes);
  }

  async relatedQueries(input: RelatedQueriesInput): Promise<RelatedQueriesOutput> {
    const relatedQueriesRes = await googleTrends.relatedQueries({
      keyword: input.keyword,
      startTime: input.startTime,
      endTime: input.endTime,
      geo: input.geo,
      hl: input.hl,
      timezone: input.timezone,
      category: input.category,
    });

    return JSON.parse(relatedQueriesRes);
  }
}