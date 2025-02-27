import { Router } from "express";
import { find } from "../../../core/DependencyInjection";
import { ConnectFacebookAccountController } from "../controllers/users/ConnectFacebookAccountController";
import { _ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { DisconnectFacebookAccountController } from "../controllers/users/DisconnectFacebookAccountController";

export const usersFacebookAccountRouter = Router();

usersFacebookAccountRouter.post('/connect', _ensureAuthenticated, (req, res) => find(ConnectFacebookAccountController).handle(req, res));
usersFacebookAccountRouter.delete('/disconnect', _ensureAuthenticated, (req, res) => find(DisconnectFacebookAccountController).handle(req, res));
