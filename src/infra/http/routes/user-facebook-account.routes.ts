import { Router } from "express";
import { find } from "../../../core/DependencyInjection";
import { ConnectFacebookAccountController } from "../controllers/users/ConnectFacebookAccountController";
import { _ensureAuthenticated } from "../middlewares/ensureAuthenticated";

export const usersFacebookAccountRouter = Router();

usersFacebookAccountRouter.post('/connect', _ensureAuthenticated, (req, res) => find(ConnectFacebookAccountController).handle(req, res));
