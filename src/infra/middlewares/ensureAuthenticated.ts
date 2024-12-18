import { NextFunction, Request, Response } from "express";
import { Unauthorized } from "../errors/Unauthorized";
import { find } from "../../core/DependencyInjection";
import { JwtProvider, jwtProviderAlias } from "../../providers/jwt/JwtProvider";


export const _ensureAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization;

  if (!token) {
    throw new Unauthorized();
  }

  const jwtProvider = find<JwtProvider>(jwtProviderAlias);
  const tokenSplited = token.split(' ')[1];

  if (!tokenSplited) {
    throw new Unauthorized();
  }

  const payload = await jwtProvider.verify(tokenSplited) as { id: string };

  req.user = {
    id: payload.id,
  }
  
  next();
}