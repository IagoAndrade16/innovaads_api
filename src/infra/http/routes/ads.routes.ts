import { Router } from "express";

import { find } from "../../../core/DependencyInjection";
import { FetchCreativesController } from "../controllers/ads/FetchCreativesController";
import { _ensureAuthenticatedWithPlan } from "../middlewares/ensureAuthenticated";

export const adsRouter = Router();

adsRouter.post('/creatives/fetch', _ensureAuthenticatedWithPlan, (req, res) => find(FetchCreativesController).handle(req, res));
