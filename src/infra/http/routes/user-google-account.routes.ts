import { Router } from "express";
import { _ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { find } from "../../../core/DependencyInjection";
import { ConnectGoogleAccountController } from "../controllers/users/ConnectGoogleAccountController";
import { DisconnectGoogleAccountController } from "../controllers/users/DisconnectGoogleAccountController";

export const usersGoogleAccountRouter = Router();

usersGoogleAccountRouter.post('/connect', _ensureAuthenticated, (req, res) => find(ConnectGoogleAccountController).handle(req, res));
usersGoogleAccountRouter.delete('/disconnect', _ensureAuthenticated, (req, res) => find(DisconnectGoogleAccountController).handle(req, res));