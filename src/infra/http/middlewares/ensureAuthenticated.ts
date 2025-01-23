import { NextFunction, Request, Response } from "express";
import { find } from "../../../core/DependencyInjection";
import { UnauthorizedError } from "../../../domain/errors/Unauthorized";
import { JwtProvider, jwtProviderAlias } from "../../../providers/jwt/JwtProvider";


export const _ensureAuthenticated = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization;

  if (!token) {
    throw new UnauthorizedError('UNAUTHORIZED');
  }

  const jwtProvider = find<JwtProvider>(jwtProviderAlias);
  const tokenSplited = token.split(' ')[1];

  if (!tokenSplited) {
    throw new UnauthorizedError('UNAUTHORIZED');
  }

  const payload = await jwtProvider.verify(tokenSplited) as { id?: string, subject?: string };

  req.user = {
    id: (payload.id ?? payload.subject)!,
  }
  
  next();
}