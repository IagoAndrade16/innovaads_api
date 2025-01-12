import { find } from "../../../core/DependencyInjection";
import { ResolutionInterestByRegion } from "../dtos/interestByRegionDTO";
import { TrendsProvider, trendsProviderAlias } from "../TrendsProvider";

const trendsProvider = find<TrendsProvider>(trendsProviderAlias);

it('should fetch daily trends', async () => {
  const dailyTrendsResponse = await trendsProvider.fetchDailyTrends({
    geo: 'US',
    hl: 'en',
    timezone: 300,
    trendDate: new Date('2025-01-08'),
  });

  expect(dailyTrendsResponse).toEqual({
    default: {
      endDateForNextRequest: expect.any(String),
      rssFeedPageUrl: expect.any(String),
      trendingSearchesDays: expect.arrayContaining([
        expect.objectContaining({
          date: expect.any(String),
          formattedDate: expect.any(String),
          trendingSearches: expect.arrayContaining([
            expect.objectContaining({
              title: expect.any(Object),
              formattedTraffic: expect.any(String),
              relatedQueries: expect.any(Array),
              image: expect.objectContaining({
                newsUrl: expect.any(String),
                source: expect.any(String),
                imageUrl: expect.any(String),
              }),
            }),
          ]),
        })
      ]),
    },
  });
});

it('should fetch interest over time', async () => {
  const interestOverTimeResponse = await trendsProvider.fetchInterestOverTime({
    keyword: ['JavaScript'],
  });

  expect(interestOverTimeResponse).toEqual({
    default: {
      timelineData: expect.arrayContaining([
        expect.objectContaining({
          time: expect.any(String),
          formattedTime: expect.any(String),
          formattedAxisTime: expect.any(String),
          value: expect.any(Array),
          hasData: expect.any(Array),
          isPartial: expect.any(Boolean),
        }),
      ]),
      averages: expect.any(Array),
    },
  });
});

it('should fetch interest by region', async () => {
  const interestByRegionResponse = await trendsProvider.interestByRegion({
    keyword: ['JavaScript'],
    geo: ['BR'],
    resolution: ResolutionInterestByRegion.CITY,
  });

  expect(interestByRegionResponse).toEqual({
    default: {
      geoMapData: expect.arrayContaining([
        expect.objectContaining({
          coordinates: expect.objectContaining({
            lat: expect.any(Number),
            lng: expect.any(Number),
          }),
          geoName: expect.any(String),
          value: expect.any(Array),
          maxValueIndex: expect.any(Number),
        })
      ])
    },
  });
});

it('should fetch related queries', async () => {
  const relatedQueriesResponse = await trendsProvider.relatedQueries({
    keyword: 'JavaScript',
  });

  expect(relatedQueriesResponse).toEqual({
    default: {
      rankedList: expect.any(Array),
    },
  });
});