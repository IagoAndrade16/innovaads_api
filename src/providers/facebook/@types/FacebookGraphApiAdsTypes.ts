export enum AdActiveStatus {
  ACTIVE = 'ACTIVE',
  ALL = 'ALL',
  INACTIVE = 'INACTIVE',
}

export enum AdType {
  ALL = 'ALL',
  EMPLOYMENT_ADS = 'EMPLOYMENT_ADS',
  FINANCIAL_PRODUCTS_AND_SERVICES_ADS = 'FINANCIAL_PRODUCTS_AND_SERVICES_ADS',
  HOUSING_ADS = 'HOUSING_ADS',
  POLITICAL_AND_ISSUE_ADS = 'POLITICAL_AND_ISSUE_ADS',
}

export enum AdMediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  ALL = 'ALL',
  MEME = 'MEME',
  NONE = 'NONE',
}

export enum AdPublisherPlatform {
  AUDIENCE_NETWORK = 'AUDIENCE_NETWORK',
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
  MESSENGER = 'MESSENGER',
  WHATSAPP = 'WHATSAPP',
  THREADS = 'THREADS',
  OCULUS = 'OCULUS',
}

export enum AdSearchType {
  KEYWORD_UNORDERED = 'KEYWORD_UNORDERED',
  KEYWORD_EXACT_PHRASE = 'KEYWORD_EXACT_PHRASE',
}

export type AudienceDistribution = {
  age?: string;
  gender?: string;
  percentage?: string;
  region?: string;
}

export type InsightsRangeValue = {
  lower_bound?: number;
  upper_bound?: number;
}

export type FetchFacebookAdsInput = {
  filters: {
    search_terms: string;
    ad_reached_countries: string;
    ad_active_status?: AdActiveStatus;
    ad_delivery_date_max?: string;
    ad_delivery_date_min?: string;
    ad_type?: AdType;
    bylines?: string[];
    delivery_by_region?: string[];
    estimated_audience_size_max?: number;
    estimated_audience_size_min?: number;
    languages?: string[];
    media_type?: AdMediaType;
    publisher_platforms?: AdPublisherPlatform[];
    search_page_ids?: number[];
    search_type?: AdSearchType;
    unmask_removed_content?: boolean;
  },
  fields: {
    id?: boolean;
    ad_creation_time?: boolean;
    ad_creative_body?: boolean;
    ad_creative_link_captions?: boolean;
    ad_creative_link_descriptions?: boolean;
    ad_creative_link_titles?: boolean;
    ad_delivery_start_time?: boolean;
    ad_delivery_stop_time?: boolean;
    ad_snapshot_url?: boolean;
    age_country_gender_reach_breakdown?: boolean;
    beneficiary_payers?: boolean;
    br_total_reach?: boolean;
    bylines?: boolean;
    currency?: boolean;
    delivery_by_region?: boolean;
    demographic_distribution?: boolean;
    estimated_audience_size?: boolean;
    eu_total_reach?: boolean;
    impressions?: boolean;
    languages?: boolean;
    page_id?: boolean;
    page_name?: boolean;
    publisher_platforms?: boolean;
    spend?: boolean;
    target_ages?: boolean;
    target_gender?: boolean;
    target_location?: boolean;
  }
};

export type FetchFacebookAdsOutput = {
  ads: {
    id?: string;
    ad_creation_time?: string;
    ad_creative_body?: string[];
    ad_creative_link_captions?: string[];
    ad_creative_link_descriptions?: string[];
    ad_creative_link_titles?: string[];
    ad_delivery_start_time?: string;
    ad_delivery_stop_time?: string;
    ad_snapshot_url?: string;
    age_country_gender_reach_breakdown?: {
      age_range?: string;
      female?: number;
      male?: number;
      unknown?: number;
    }[];
    beneficiary_payers?: {
      beneficiary?: string;
      current?: string;
      payer?: string;
    }[];
    br_total_reach?: number
    bylines?: string;
    currency?: string;
    delivery_by_region: AudienceDistribution[];
    demographic_distribution?: AudienceDistribution[];
    estimated_audience_size?: InsightsRangeValue;
    eu_total_reach?: number;
    impressions?: InsightsRangeValue;
    languages?: string[];
    page_id?: string;
    page_name?: string;
    publisher_platforms?: AdPublisherPlatform[];
    spend?: InsightsRangeValue;
    target_ages?: string[];
    target_gender?: string[];
    target_location?: {
      excluded: boolean;
      name: string;
      num_obfuscated: number;
      type: 'country' | 'region' | 'postal' | 'code' | 'city';
    }[];
  }[];
};
