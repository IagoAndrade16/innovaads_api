import { Router } from "express";

import { find } from "../../../core/DependencyInjection";
import { SignPackageController } from "../controllers/subscriptions/SignPackageController";
import { _ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { GetUserBillingSummaryController } from "../controllers/subscriptions/GetUserBillingSummaryController";
import { CancelSubscriptionController } from "../controllers/subscriptions/CancelSubscriptionController";

export const subscriptionsRouter = Router();

subscriptionsRouter.post('/', _ensureAuthenticated, (req, res) => find(SignPackageController).handle(req, res));
subscriptionsRouter.get('/', _ensureAuthenticated, (req, res) => find(GetUserBillingSummaryController).handle(req, res));
subscriptionsRouter.delete('/', _ensureAuthenticated, (req, res) => find(CancelSubscriptionController).handle(req, res));
