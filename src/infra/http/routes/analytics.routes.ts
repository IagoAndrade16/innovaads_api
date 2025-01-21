import { Router } from "express";

import { find } from "../../../core/DependencyInjection";
import { FetchDailyTrendsController } from "../controllers/analytics/FetchDailyTrendsController";
import { _ensureAuthenticated } from "../middlewares/ensureAuthenticated";

export const analyticsRouter = Router();

analyticsRouter.get('/trends/daily', _ensureAuthenticated, (req, res) => find(FetchDailyTrendsController).handle(req, res));