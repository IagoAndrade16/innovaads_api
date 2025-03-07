/* eslint-disable */

import { injectable } from "tsyringe";
import { GoogleAuthProvider } from "../GoogleAuthProvider";
import { JsObject } from "../../../@types/JsObject";
import { urlJoin } from "url-join-ts";
import { Environment } from "../../../core/Enviroment";
import { GetAuthTokenRequest, GetAuthTokenRequestResponse, GetAuthTokenResponse } from "../@types/GoogleAuthProviderTypes";

@injectable()
export class GoogleAuthProviderImpl extends GoogleAuthProvider {
  async getAuthToken(data: GetAuthTokenRequest): Promise<GetAuthTokenResponse> {
    const response = await this.post<GetAuthTokenRequestResponse>('/token', {
      client_id: Environment.vars.GOOGLE_CLIENT_ID,
      code: data.code,
      client_secret: Environment.vars.GOOGLE_CLIENT_SECRET_KEY,
      grant_type: 'authorization_code',
      redirect_uri: Environment.vars.GOOGLE_REDIRECT_URI,
    });

    if (response.statusCode === 200) {
      return {
        status: 'SUCCESS',
        data: response.data
      }
    }

    if (response.statusCode === 400) {
      return {
        status: 'BAD_REQUEST',
        data: null,
      }
    }

    return {
      status: 'BAD_REQUEST',
      data: null,
    }
  }

  buildUrl(endpoint: string, data?: JsObject): string {    
    return urlJoin(Environment.vars.GOOGLE_OAUTH_BASE_URL, endpoint);
  }

  headers(): JsObject {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    return headers;
  }
}