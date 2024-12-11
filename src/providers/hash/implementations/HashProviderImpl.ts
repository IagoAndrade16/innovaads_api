import bcrypt from 'bcryptjs';
import { HashProvider } from '../HashProvider';

export class HashProviderImpl implements HashProvider {
  async generateHash(password: string): Promise<string> {
    const passHashed = await  bcrypt.hash(password, 6);
    return passHashed;
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    const passMatch = await bcrypt.compare(password, hash);
    return passMatch;
  }
}