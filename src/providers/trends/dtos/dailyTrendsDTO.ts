/* eslint-disable @typescript-eslint/no-explicit-any */

export type FetchDailyTrendsInput = {
  geo: string;
  hl?: string
  timezone?: number;
  trendDate?: Date;
}

export type FetchDailyTrendsOutput = {
  default: {
    trendingSearchesDays: TrendingSearchesDays[];
  }
}

export type TrendingSearchesDays = {
  date: string;
  formattedDate: string;
  trendingSearches: TrendingSearch[];
};

export type TrendingSearch = {
  title: {
    query: string;
    exploreLink: string;
  };
  formattedTraffic: string;
  relatedQueries: any[];
  image: {
    newsUrl: string;
    source: string;
    imageUrl: string;
  };
  articles: ArticleDailyTrends[];
}

export type ArticleDailyTrends = {
  title: string;
  timeAgo: string;
  source: string;
  url: string;
  image: {
    newsUrl: string;
    source: string;
    imageUrl: string;
  };
  snippet: string;
}