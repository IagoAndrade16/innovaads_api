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
      options: {
        agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      }
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
      options: {
        agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      }
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
      resolution: input.resolution,
      options: {
        agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      }
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
      options: {
        agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      }
    });

    return JSON.parse(relatedQueriesRes);
  }
}