import { JsObject } from "../../../@types/JsObject";

export type GraphApiObject = {
  filters: JsObject;
  fields: JsObject;
}

export type GetLongLivedAccessTokenInput = {
  access_token: string;
} 

export type GetLongLivedAccessTokenOutput = {
  status: 'BAD_REQUEST' | 'UNAUTHORIZED' | 'ERROR' | 'SUCCESS';
  data?: {
    access_token: string;
    token_type: 'bearer';
    expires_in: number;
  }
};