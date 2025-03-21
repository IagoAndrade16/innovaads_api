import { Request, Response } from "express";
import { Controller } from "../../../../core/Controller";
import { inject, injectable } from "tsyringe";
import { FetchNotificationsUseCase } from "../../../../domain/modules/notifications/usecases/FetchNotificationsUseCase";


@injectable()
export class FetchNotificationsController implements Controller {
  constructor (
    @inject(FetchNotificationsUseCase)
    private readonly fetchNotificationsUseCase: FetchNotificationsUseCase,
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { id: userId } = req.user!;

    const notifications = await this.fetchNotificationsUseCase.execute({
      userId,
    });

    res.status(200).send({
      notifications,
    })
  }
}