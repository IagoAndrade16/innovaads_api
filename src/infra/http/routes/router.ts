import { Router } from "express";
import { usersRouter } from "./users.routes";
import { analyticsRouter } from "./analytics.routes";
import { packagesRouter } from "./packages.routes";
import { adsRouter } from "./ads.routes";

const appRouter = Router();

appRouter.use('/users', usersRouter);
appRouter.use('/analytics', analyticsRouter);
appRouter.use('/packages', packagesRouter);
appRouter.use('/ads', adsRouter);

export { appRouter };