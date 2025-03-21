import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { Controller } from "../../../../core/Controller";
import { ConnectFacebookAccountUseCase } from "../../../../domain/modules/users/usecases/ConnectFacebookAccountUseCase";
import * as yup from 'yup';

@injectable()
export class ConnectFacebookAccountController implements Controller {
  constructor(
    @inject(ConnectFacebookAccountUseCase)
    private readonly usecase: ConnectFacebookAccountUseCase,
  ) {}
  private bodySchema = yup.object().shape({
    accessToken: yup.string().required(),
    expiresIn: yup.number().required(),
    userIdOnFacebook: yup.string().required(),
  });

  async handle(req: Request, res: Response): Promise<void> {
    const body = await this.bodySchema.validate(req.body, { abortEarly: false });

    const usecaseRes = await this.usecase.execute({
      accessToken: body.accessToken,
      expiresIn: body.expiresIn,
      userIdOnFacebook: body.userIdOnFacebook,
      userId: req.user!.id,
    });

    res.status(200).send(usecaseRes);
  }
}