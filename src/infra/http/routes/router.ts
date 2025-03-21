import { Router } from "express";
import { usersRouter } from "./users.routes";
import { analyticsRouter } from "./analytics.routes";
import { packagesRouter } from "./packages.routes";
import { adsRouter } from "./ads.routes";
import { notificationsRouter } from "./notifications.routes";

const appRouter = Router();

appRouter.use('/users', usersRouter);
appRouter.use('/analytics', analyticsRouter);
appRouter.use('/packages', packagesRouter);
appRouter.use('/ads', adsRouter);
appRouter.use('/notifications', notificationsRouter);

export { appRouter };