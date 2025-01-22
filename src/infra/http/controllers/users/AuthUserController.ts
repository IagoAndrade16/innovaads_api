import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { Controller } from "../../../../core/Controller";
import { Utils } from "../../../../core/Utils";
import { AuthUserUseCase } from "../../../../domain/modules/users/usecases/AuthUserUseCase";
import { UnauthorizedError } from "../../../../domain/errors/Unauthorized";

@injectable()
export class AuthUserController implements Controller {
  constructor(
    @inject(AuthUserUseCase)
    private readonly authUserUseCase: AuthUserUseCase,
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
		const [email, password] = Utils.getBasicAuthContentFromReq(req);

    if(!email || !password) {
      throw new UnauthorizedError('INVALID_CREDENTIALS');
    }

    const result = await this.authUserUseCase.execute({
      email,
      password,
    });

    res.status(200).send(result);
  }
}