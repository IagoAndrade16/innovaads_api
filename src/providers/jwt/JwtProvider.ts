/* eslint-disable @typescript-eslint/no-explicit-any */
export type JwtProvider = {
  sign(data: SignData): Promise<string>;
  verify(token: string): Promise<object | null>;
}

export type SignData = Record<string, any>;

export const jwtProviderAlias = 'JwtProvider';