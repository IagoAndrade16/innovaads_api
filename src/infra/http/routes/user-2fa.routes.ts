import { Router } from "express";
import { _ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { find } from "../../../core/DependencyInjection";
import { SendUser2FAController } from "../controllers/users/SendUser2FAController";
import { VerifyUser2FACodeController } from "../controllers/users/VerifyUser2FACodeController";
import { Send2FAForgotPasswordController } from "../controllers/users/Send2FAForgotPassowordController";
import { VerifyUserForgotPassword2FAController } from "../controllers/users/VerifyUserForgotPassword2FAController";
import { UpdateForgotUserPasswordController } from "../controllers/users/UpdateForgotUserPasswordController";

export const users2faRouter = Router();

users2faRouter.get('', _ensureAuthenticated, (req, res) => find(SendUser2FAController).handle(req, res));
users2faRouter.post('/verify', _ensureAuthenticated, (req, res) => find(VerifyUser2FACodeController).handle(req, res));

users2faRouter.post('/forgot-password', (req, res) => find(Send2FAForgotPasswordController).handle(req, res));
users2faRouter.post('/forgot-password/verify', (req, res) => find(VerifyUserForgotPassword2FAController).handle(req, res));
users2faRouter.post('/forgot-password/reset', (req, res) => find(UpdateForgotUserPasswordController).handle(req, res));