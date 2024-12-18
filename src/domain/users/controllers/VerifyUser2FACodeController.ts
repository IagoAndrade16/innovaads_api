import { Request, Response } from "express";
import { Controller } from "../../../core/Controller";
import { inject, injectable } from "tsyringe";
import * as yup from "yup";
import { VerifyUser2FACodeUseCase } from "../usecases/VerifyUser2FACodeUseCase";

@injectable()
export class VerifyUser2FACodeController implements Controller {
  constructor (
    @inject(VerifyUser2FACodeUseCase)
    private readonly verifyUser2FACodeUseCase: VerifyUser2FACodeUseCase,
  ) {}

  private querySchema = yup.object().shape({
    code: yup.string().required(),
  });

  async handle(req: Request, res: Response): Promise<void> {
    const { code } = await this.querySchema.validate(req.query, { abortEarly: false });
    const { id: userId } = req.user!;

    await this.verifyUser2FACodeUseCase.execute({
      code,
      userId,
    }); 

    res.status(200).send();
  }
}