import { Request, Response } from "express";
import { Controller } from "../../../../core/Controller";
import { inject, injectable } from "tsyringe";
import { Send2FAForgotPasswordUseCase } from "../../../../domain/modules/users/usecases/Send2FAForgotPasswordUseCase";
import * as yup from 'yup';

@injectable()
export class Send2FAForgotPasswordController implements Controller {
  constructor(
    @inject(Send2FAForgotPasswordUseCase)
    private usecase: Send2FAForgotPasswordUseCase,
  ) {}

  private bodySchema = yup.object().shape({
    email: yup.string().email().required(),
  });

  async handle(req: Request, res: Response): Promise<void> {
    const { email } = await this.bodySchema.validate(req.body, { abortEarly: false });

    await this.usecase.execute({ email });

    res.status(204).send();
  }
}