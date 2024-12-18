import { RandomProvider } from "../RandomProvider";


export class RandomProviderImpl implements RandomProvider {
  async generateRandomNumber(min: number = 0, max: number = 100): Promise<number> {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}