import { Router } from "express";
import { usersRouter } from "./users.routes";
import { analyticsRouter } from "./analytics.routes";

const appRouter = Router();

appRouter.use('/users', usersRouter);
appRouter.use('/analytics', analyticsRouter);


export { appRouter };