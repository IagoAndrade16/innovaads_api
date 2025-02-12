import { Router } from "express";

import { find } from "../../../core/DependencyInjection";
import { FetchDailyTrendsController } from "../controllers/analytics/FetchDailyTrendsController";
import { _ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { SearchInterestController } from "../controllers/analytics/SearchInterestController";
import { MostInterestedRegionsController } from "../controllers/analytics/MostInterestedRegionsController";

export const analyticsRouter = Router();

analyticsRouter.get('/trends/daily', _ensureAuthenticated, (req, res) => find(FetchDailyTrendsController).handle(req, res));
analyticsRouter.get('/trends/search-interest', _ensureAuthenticated, (req, res) => find(SearchInterestController).handle(req, res));
analyticsRouter.get('/trends/regions', _ensureAuthenticated, (req, res) => find(MostInterestedRegionsController).handle(req, res));
