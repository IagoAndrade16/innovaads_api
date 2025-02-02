import { Router } from "express";

import { find } from "../../../core/DependencyInjection";
import { SignPackageController } from "../controllers/subscriptions/SignPackageController";
import { _ensureAuthenticated } from "../middlewares/ensureAuthenticated";

export const subscriptionsRouter = Router();

subscriptionsRouter.post('/', _ensureAuthenticated, (req, res) => find(SignPackageController).handle(req, res));
