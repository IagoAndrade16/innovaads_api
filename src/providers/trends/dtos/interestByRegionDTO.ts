export type InterestByRegionInput = {
  keyword: string[];
  startTime?: Date;
  endTime?: Date;
  geo?: string[];
  hl?: string;
  timezone?: number;
  category?: number;
}

export type InterestByRegionOutput = {
  default: {
    geoMapData: GeoMapData[];
  }
}

export type GeoMapData = {
  coordinates: {
    lat: number;
    lng: number;
  },
  geoName: string;
  value: number[];
  maxValueIndex: number;
}