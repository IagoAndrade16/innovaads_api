import { Router } from "express";

import { find } from "../../../core/DependencyInjection";
import { FetchDailyTrendsController } from "../controllers/analytics/FetchDailyTrendsController";
import { SearchInterestController } from "../controllers/analytics/SearchInterestController";
import { MostInterestedRegionsController } from "../controllers/analytics/MostInterestedRegionsController";
import { _ensureAuthenticatedWithPlan } from "../middlewares/ensureAuthenticated";

export const analyticsRouter = Router();

analyticsRouter.get('/trends/daily', _ensureAuthenticatedWithPlan, (req, res) => find(FetchDailyTrendsController).handle(req, res));
analyticsRouter.get('/trends/search-interest', _ensureAuthenticatedWithPlan, (req, res) => find(SearchInterestController).handle(req, res));
analyticsRouter.get('/trends/regions', _ensureAuthenticatedWithPlan, (req, res) => find(MostInterestedRegionsController).handle(req, res));
