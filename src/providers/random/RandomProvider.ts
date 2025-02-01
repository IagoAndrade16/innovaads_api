export type RandomProvider = {
	string(length: number, type: StringType): string;
	integer(min?: number, max?: number): Promise<number>;
	sample<T>(array: T[], amount: number): Promise<T[]>;
}

export type StringType = 'alpha' | 'numeric' | 'alphanumeric';

export const randomProviderAlias = 'RandomProvider';
