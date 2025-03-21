import { Router } from "express";
import { _ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { find } from "../../../core/DependencyInjection";
import { FetchNotificationsController } from "../controllers/notifications/FetchNotificationsController";
import { MarkNotificationAsRead } from "../controllers/notifications/MarkNotificationAsReadController";


export const notificationsRouter = Router();


notificationsRouter.get('/', _ensureAuthenticated, (req, res) => find(FetchNotificationsController).handle(req, res));
notificationsRouter.patch('/read/:notificationId', _ensureAuthenticated, (req, res) => find(MarkNotificationAsRead).handle(req, res));