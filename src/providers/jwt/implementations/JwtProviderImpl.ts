import jwt from 'jsonwebtoken';
import { JwtProvider, SignData } from "../JwtProvider";
import { Environment } from '../../../core/Enviroment';

export class JwtProviderImpl implements JwtProvider {
  async sign(data: SignData): Promise<string> {
    return jwt.sign({ ...data }, Environment.vars.JWT_SECRET_KEY, {
      expiresIn: Environment.vars.JWT_EXPIRES_IN_SECONDS,
    });
  }

  async verify(token: string): Promise<object | null> {
    try {
      return jwt.verify(token, Environment.vars.JWT_SECRET_KEY) as object;
    } catch {
      return null;
    }
  }
}