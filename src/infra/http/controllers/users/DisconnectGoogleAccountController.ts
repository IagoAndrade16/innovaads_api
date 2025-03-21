import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { Controller } from "../../../../core/Controller";

import { DisconnectGoogleAccountUseCase } from "../../../../domain/modules/users/usecases/DisconnectGoogleAccountUseCase";

@injectable()
export class DisconnectGoogleAccountController implements Controller {
  constructor(
    @inject(DisconnectGoogleAccountUseCase)
    private readonly usecase: DisconnectGoogleAccountUseCase,
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    await this.usecase.execute({
      userId: req.user!.id,
    });

    res.status(204).send();
  }
}