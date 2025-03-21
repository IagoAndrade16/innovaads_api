import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { Controller } from "../../../../core/Controller";
import { DisconnectFacebookAccountUseCase } from "../../../../domain/modules/users/usecases/DisconnectFacebookAccountUseCase";

@injectable()
export class DisconnectFacebookAccountController implements Controller {
  constructor(
    @inject(DisconnectFacebookAccountUseCase)
    private readonly usecase: DisconnectFacebookAccountUseCase,
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const usecaseRes = await this.usecase.execute({
      userId: req.user!.id,
    });

    res.status(204).send(usecaseRes);
  }
}