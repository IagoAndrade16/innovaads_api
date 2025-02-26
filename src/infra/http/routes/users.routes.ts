import { Router } from "express";
import { find } from "../../../core/DependencyInjection";
import { AuthUserController } from "../controllers/users/AuthUserController";
import { CreateUserController } from "../controllers/users/CreateUserController";
import { UpdateUserController } from "../controllers/users/UpdateUserController";
import { UpdateUserPasswordController } from "../controllers/users/UpdateUserPasswordController";
import { _ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { users2faRouter } from "./user-2fa.routes";
import { usersFacebookAccountRouter } from "./user-facebook-account.routes";

export const usersRouter = Router();

usersRouter.post('/', (req, res) => find(CreateUserController).handle(req, res));
usersRouter.put('/', _ensureAuthenticated, (req, res) => find(UpdateUserController).handle(req, res));
usersRouter.patch('/password', _ensureAuthenticated, (req, res) => find(UpdateUserPasswordController).handle(req, res));

usersRouter.post('/auth', (req, res) => find(AuthUserController).handle(req, res));

usersRouter.use('/2fa', users2faRouter);
usersRouter.use('/facebook-account', usersFacebookAccountRouter);



