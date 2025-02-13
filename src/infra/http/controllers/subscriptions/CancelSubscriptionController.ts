import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { Controller } from "../../../../core/Controller";
import { CancelSubscriptionUseCase } from "../../../../domain/modules/subscriptions/usecases/CancelSubscriptionUseCase";


@injectable()
export class CancelSubscriptionController implements Controller {
  constructor(
    @inject(CancelSubscriptionUseCase)
    private readonly usecase: CancelSubscriptionUseCase,
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    await this.usecase.execute({
      userId: req.user!.id
    });

    res.status(204).send();
  }
}