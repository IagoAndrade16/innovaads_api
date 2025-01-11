export type RelatedQueriesInput = {
  keyword: string;
  startTime?: string;
  endTime?: string;
  geo?: string;
  hl?: string;
  timezone?: string;
  category?: string;
}

export type RelatedQueriesOutput = {
  deafult: {
    rankedList: RankedKeyWord[];
  }
}

type RankedKeyWord = {
  query: string;
  value: number;
  link: string;
}