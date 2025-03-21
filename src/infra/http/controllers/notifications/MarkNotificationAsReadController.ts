import { Request, Response } from "express";
import { Controller } from "../../../../core/Controller";
import { inject, injectable } from "tsyringe";
import { MarkNotificationAsReadUseCase } from "../../../../domain/modules/notifications/usecases/MarkNotificationAsReadUseCase";
import * as yup from "yup";


@injectable()
export class MarkNotificationAsRead implements Controller {
  constructor (
    @inject(MarkNotificationAsReadUseCase)
    private readonly markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
  ) {}

  private paramsSchema = yup.object({
    notificationId: yup.string().required(),
  });

  async handle(req: Request, res: Response): Promise<void> {
    const { id: userId } = req.user!;
    const { notificationId } = await this.paramsSchema.validate(req.params, { abortEarly: false });

    await this.markNotificationAsReadUseCase.execute({
      userId,
      notificationId,
    });

    res.status(204).send();
  }
}