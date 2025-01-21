import { Router } from "express";
import { _ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { find } from "../../core/DependencyInjection";
import { FetchDailyTrendsController } from "../../domain/analytics/controllers/FetchDailyTrendsController";

export const analyticsRouter = Router();

analyticsRouter.get('/trends/daily', _ensureAuthenticated, (req, res) => find(FetchDailyTrendsController).handle(req, res));