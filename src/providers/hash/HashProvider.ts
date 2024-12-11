export type HashProvider = {
  generateHash(password: string): Promise<string>;
  compareHash(password: string, hash: string): Promise<boolean>;
}

export const hashProviderAlias = 'HashProvider';