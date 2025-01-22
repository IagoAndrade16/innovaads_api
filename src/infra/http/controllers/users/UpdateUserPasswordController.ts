import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import * as yup from 'yup';
import { Controller } from "../../../../core/Controller";
import { UpdateUserPasswordUseCase } from "../../../../domain/modules/users/usecases/UpdateUserPasswordUseCase";


@injectable()
export class UpdateUserPasswordController implements Controller {
  constructor (
    @inject(UpdateUserPasswordUseCase)
    private readonly usecase: UpdateUserPasswordUseCase,
  ) {}

  private bodySchema = yup.object().shape({
    actualPassword: yup.string().required(),
    newPassword: yup.string().required().min(6),
  })

  async handle(req: Request, res: Response): Promise<void> {
    const body = await this.bodySchema.validate(req.body, { abortEarly: false });

    await this.usecase.execute({
      userId: req.user!.id,
      actualPassword: body.actualPassword,
      newPassword: body.newPassword,
    });

    res.status(204).send();
  }
}