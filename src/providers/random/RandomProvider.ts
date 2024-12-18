export type RandomProvider = {
  generateRandomNumber(min: number, max: number): Promise<number>;
}

export const randomProviderAlias = 'RandomProvider' as const;