/* eslint-disable */

import { injectable } from "tsyringe";
import { GoogleAuthProvider } from "../GoogleAuthProvider";
import { JsObject } from "../../../@types/JsObject";
import { urlJoin } from "url-join-ts";
import { Environment } from "../../../core/Enviroment";
import { GetAuthTokenRequest, GetAuthTokenResponse } from "../@types/GoogleAuthProviderTypes";

@injectable()
export class GoogleAuthProviderImpl extends GoogleAuthProvider {
  async getAuthToken(data: GetAuthTokenRequest): Promise<GetAuthTokenResponse> {
    const response = await this.post('/token', {
      client_id: Environment.vars.GOOGLE_CLIENT_ID,
      code: data.code,
      client_secret: Environment.vars.GOOGLE_CLIENT_SECRET_KEY,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:5173/test-auth',
    });

    return response.data as GetAuthTokenResponse;
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