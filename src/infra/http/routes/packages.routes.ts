import { Router } from "express";

import { find } from "../../../core/DependencyInjection";
import { CreatePackageController } from "../controllers/packages/CreatePackageController";
import { ListPackagesController } from "../controllers/packages/ListPackagesController";
import { _ensureAuthenticatedAsAdmin } from "../middlewares/ensureAuthenticated";
import { subscriptionsRouter } from "./subscriptions.routes";


export const packagesRouter = Router();

packagesRouter.post('/', _ensureAuthenticatedAsAdmin, (req, res) => find(CreatePackageController).handle(req, res));
packagesRouter.get('/', (req, res) => find(ListPackagesController).handle(req, res));

packagesRouter.use('/subscriptions', subscriptionsRouter);
