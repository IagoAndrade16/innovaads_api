import { NextFunction, Request, Response } from "express";
import { find } from "../../../core/DependencyInjection";
import { UnauthorizedError } from "../../../domain/errors/Unauthorized";
import { JwtProvider, jwtProviderAlias } from "../../../providers/jwt/JwtProvider";
import { UsersRepository, usersRepositoryAlias } from "../../../domain/modules/users/repositories/UsersRepository";
import { ForbiddenError } from "../../../domain/errors/ForbiddenError";


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


export const _ensureAuthenticatedWithPlan = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
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
  const userId = (payload.id ?? payload.subject)!;
  
  const usersRepository = find<UsersRepository>(usersRepositoryAlias);
  const user = await usersRepository.findById(userId);

  if(!user) {
    throw new UnauthorizedError('UNAUTHORIZED');
  }

  if(user.needsToBuyPlan) {
    throw new ForbiddenError();
  }

  req.user = {
    id: (payload.id ?? payload.subject)!,
  }
  
  next();
}