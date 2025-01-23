import { Router } from "express";

import { find } from "../../../core/DependencyInjection";
import { FetchDailyTrendsController } from "../controllers/analytics/FetchDailyTrendsController";
import { _ensureAuthenticatedWithPlan } from "../middlewares/ensureAuthenticated";

export const analyticsRouter = Router();

analyticsRouter.get('/trends/daily', _ensureAuthenticatedWithPlan, (req, res) => find(FetchDailyTrendsController).handle(req, res));