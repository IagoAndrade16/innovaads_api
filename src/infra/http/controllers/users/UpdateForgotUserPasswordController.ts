import { Request, Response } from "express";
import { Controller } from "../../../../core/Controller";
import { inject, injectable } from "tsyringe";
import { UpdateForgotUserPasswordUseCase } from "../../../../domain/modules/users/usecases/UpdateForgotUserPasswordUseCase";
import * as yup from "yup";

@injectable()
export class UpdateForgotUserPasswordController implements Controller {
  constructor (
    @inject(UpdateForgotUserPasswordUseCase)
    private usecase: UpdateForgotUserPasswordUseCase,
  ) {}

  private bodySchema = yup.object().shape({
    email: yup.string().email().required(),
    newPassword: yup.string().min(6).required(),
  }); 

  async handle(req: Request, res: Response): Promise<void> {
    const { email, newPassword } = await this.bodySchema.validate(req.body, { abortEarly: false });

    await this.usecase.execute({
      email,
      newPassword,
    });

    res.status(204).send();
  }
}