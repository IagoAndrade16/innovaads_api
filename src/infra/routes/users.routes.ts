import { Router } from "express";
import { find } from "../../core/DependencyInjection";
import { CreateUserController } from "../../domain/users/controllers/CreateUserController";
import { AuthUserController } from "../../domain/users/controllers/AuthUserController";
import { SendUser2FAController } from "../../domain/users/controllers/SendUser2FAController";
import { _ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { VerifyUser2FACodeController } from "../../domain/users/controllers/VerifyUser2FACodeController";

export const usersRouter = Router();

usersRouter.post('/', (req, res) => find(CreateUserController).handle(req, res));
usersRouter.post('/auth', (req, res) => find(AuthUserController).handle(req, res));
usersRouter.get('/2fa', _ensureAuthenticated, (req, res) => find(SendUser2FAController).handle(req, res));
usersRouter.get('/2fa/verify', _ensureAuthenticated, (req, res) => find(VerifyUser2FACodeController).handle(req, res));


