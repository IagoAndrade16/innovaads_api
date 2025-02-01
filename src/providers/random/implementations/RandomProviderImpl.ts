import { RandomProvider, StringType } from '../RandomProvider';

export class RandomProviderImpl implements RandomProvider {
	public string(length: number, type: StringType): string {
		let result = '';
		const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		const numeric = '0123456789';

		let characters = '';
		if (type === 'alpha') characters = alpha;
		else if (type === 'numeric') characters = numeric;
		else characters = alpha + numeric;

		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	// min inclusive, max exclusive
	// integer
	public async integer(min = 0, max = 100): Promise<number> {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	// select amount random elements from array
	async sample<T>(array: T[], amount: number): Promise<T[]> {
		const result: T[] = [];

		for (let i = 0; i < amount; i++) {
			const index = await this.integer(0, array.length);
			result.push(array[index]);
		}

		return result;
	}
}
