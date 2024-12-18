import { Request, Response } from "express";
import { Controller } from "../../../core/Controller";
import { inject, injectable } from "tsyringe";
import { SendUser2FAUseCase } from "../usecases/SendUser2FAUseCase";


@injectable()
export class SendUser2FAController implements Controller {
  constructor (
    @inject(SendUser2FAUseCase)
    private readonly sendUser2FAUseCase: SendUser2FAUseCase,
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { id: userId } = req.user!;

    await this.sendUser2FAUseCase.execute({
      userId,
    });
    
    res.status(200).send();
  }
}