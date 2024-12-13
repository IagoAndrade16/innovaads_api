import { Router } from "express";
import { find } from "../../core/DependencyInjection";
import { CreateUserController } from "../../domain/users/controllers/CreateUserController";
import { AuthUserController } from "../../domain/users/controllers/AuthUserController";

export const usersRouter = Router();

usersRouter.post('/', (req, res) => find(CreateUserController).handle(req, res));
usersRouter.post('/auth', (req, res) => find(AuthUserController).handle(req, res));


