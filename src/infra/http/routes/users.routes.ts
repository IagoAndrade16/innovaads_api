import { Router } from "express";
import { find } from "../../../core/DependencyInjection";
import { CreateUserController } from "../controllers/users/CreateUserController";
import { UpdateUserController } from "../controllers/users/UpdateUserController";
import { _ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { AuthUserController } from "../controllers/users/AuthUserController";
import { SendUser2FAController } from "../controllers/users/SendUser2FAController";
import { VerifyUser2FACodeController } from "../controllers/users/VerifyUser2FACodeController";

export const usersRouter = Router();

usersRouter.post('/', (req, res) => find(CreateUserController).handle(req, res));
usersRouter.put('/', _ensureAuthenticated, (req, res) => find(UpdateUserController).handle(req, res));

usersRouter.post('/auth', (req, res) => find(AuthUserController).handle(req, res));

usersRouter.get('/2fa', _ensureAuthenticated, (req, res) => find(SendUser2FAController).handle(req, res));
usersRouter.get('/2fa/verify', _ensureAuthenticated, (req, res) => find(VerifyUser2FACodeController).handle(req, res));


