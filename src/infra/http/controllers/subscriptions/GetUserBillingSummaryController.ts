import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { Controller } from "../../../../core/Controller";
import { GetUserBillingSummaryUseCase } from "../../../../domain/modules/users/usecases/GetUserBillingSummaryUseCase";

@injectable()
export class GetUserBillingSummaryController implements Controller {
  constructor(
    @inject(GetUserBillingSummaryUseCase)
    private readonly usecase: GetUserBillingSummaryUseCase,
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const result = await this.usecase.execute({
      userId: req.user!.id
    });

    res.status(200).send(result);
  }
}