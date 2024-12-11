import { Router } from "express";
import { find } from "../../core/DependencyInjection";
import { CreateUserController } from "../../domain/users/controllers/CreateUserController";

export const usersRouter = Router();

usersRouter.post('/', (req, res) => find(CreateUserController).handle(req, res));


