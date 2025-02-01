import { inject, injectable } from "tsyringe";
import { Controller } from "../../../../core/Controller";
import { Request, Response } from "express";
import { VerifyUserForgotPassword2FaUseCase } from "../../../../domain/modules/users/usecases/VerifyUserForgotPassoword2FaUseCase";

import * as yup from 'yup';


@injectable()
export class VerifyUserForgotPassword2FAController implements Controller {
  constructor (
    @inject(VerifyUserForgotPassword2FaUseCase)
    private usecase: VerifyUserForgotPassword2FaUseCase,
  ) {}

  private bodySchema = yup.object().shape({
    code: yup.string().required(),
    email: yup.string().email().required(),
  });

  async handle(req: Request, res: Response): Promise<void> {
    const { code, email } = await this.bodySchema.validate(req.body, { abortEarly: false });

    await this.usecase.execute({
      code,
      email,
    });
    
    res.status(204).send();
  }
}