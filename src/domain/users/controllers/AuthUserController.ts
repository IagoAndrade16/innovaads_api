import { Request, Response } from "express";
import { Controller } from "../../../core/Controller";
import * as yup from 'yup';
import { inject, injectable } from "tsyringe";
import { AuthUserUseCase } from "../usecases/AuthUserUseCase";

@injectable()
export class AuthUserController implements Controller {
  constructor(
    @inject(AuthUserUseCase)
    private readonly authUserUseCase: AuthUserUseCase,
  ) {}

  private bodySchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
  });

  async handle(req: Request, res: Response): Promise<void> {
    const body = await this.bodySchema.validate(req.body, { abortEarly: false });

    const result = await this.authUserUseCase.execute({
      ...body,
    });

    res.status(200).send({
      result,
    });
  }
}