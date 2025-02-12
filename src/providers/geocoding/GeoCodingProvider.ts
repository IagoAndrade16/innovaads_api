export type GeoCodingProvider = {
  getRegionByCoordinates(input: GetRegionByCoordinatesInput): Promise<GetRegionByCoordinatesOutput>;
}

export type GetRegionByCoordinatesInput = {
  lat: number,
  lon: number,
}

export type LocationDetails = {
  road: string;
  village: string;
  state_district: string;
  state: string;
  postcode: string;
  country: string;
  country_code: string;
};

export type GetRegionByCoordinatesOutput = {
  status: 'SUCCESS' | 'BAD_REQUEST';
  data: NominatimDataResponse | null;
};

export type NominatimDataResponse = {
  place_id: string;
  licence: string;
  osm_type: string;
  osm_id: string;
  lat: string;
  lon: string;
  place_rank: number;
  category: string;
  type: string;
  importance: number;
  addresstype: string;
  display_name: string;
  name: string;
  address: LocationDetails;
  boundingbox: string[];
}

export const geoCodingAlias = 'GeoCodingProvider';