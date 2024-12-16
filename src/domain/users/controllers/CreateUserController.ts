import { Request, Response } from "express";
import { Controller } from "../../../core/Controller";
import { inject, injectable } from "tsyringe";
import * as yup from 'yup';
import { ValidationsUtils } from "../../../core/ValidationUtils";
import { CreateUserUseCase } from "../usecases/CreateUserUseCase";

@injectable()
export class CreateUserController implements Controller {
  constructor (
    @inject(CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  private bodySchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required().test('validate-email', 'Invalid email', (email) => ValidationsUtils.validateEmail(email)),
    password: yup.string().required().min(6),
    phone: yup.string().required(),
  })

  async handle(req: Request, res: Response): Promise<void> {
    const body = await this.bodySchema.validate(req.body, { abortEarly: false });

    await this.createUserUseCase.execute({
      ...body,
    });

    res.status(201).send();
  }
}