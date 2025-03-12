import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { Controller } from "../../../../core/Controller";

import * as yup from 'yup';

import { ConnectGoogleAccountUseCase } from "../../../../domain/modules/users/usecases/ConnectGoogleAccountUseCase";

@injectable()
export class ConnectGoogleAccountController implements Controller {
  constructor(
    @inject(ConnectGoogleAccountUseCase)
    private readonly usecase: ConnectGoogleAccountUseCase,
  ) {}
  
  private querySchema = yup.object().shape({
    code: yup.string().required(),
  });

  async handle(req: Request, res: Response): Promise<void> {
    const { code } = await this.querySchema.validate(req.query, { abortEarly: false });

    const usecaseRes = await this.usecase.execute({
      code,
      userId: req.user!.id,
    });

    res.status(200).send(usecaseRes);
  }
}