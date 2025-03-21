export type GetAuthTokenRequest = {
  code: string;
}

export type GetAuthTokenResponse = {
  status: 'SUCCESS' | 'BAD_REQUEST';
  data: GetAuthTokenRequestResponse | null;
}

export type GetAuthTokenRequestResponse = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: 'Bearer';
  refresh_token: string;
  refresh_token_expires_in: number;
}