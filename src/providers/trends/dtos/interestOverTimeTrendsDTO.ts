export type FetchInterestOverTimeInput = {
  keyword: string[];
  startTime?: Date;
  endTime?: Date;
  geo?: string[];
  hl?: string;
  timezone?: number;
  category?: number;
}

export type FetchInterestOverTimeOutput = {
  default: {
    timelineData: TimelineData[];
  }
}

export type TimelineData = {
  time: string;
  formattedTime: string;
  formattedAxisTime: string;
  value: number[];
  hasData: boolean[];
  isPartial?: boolean;
}