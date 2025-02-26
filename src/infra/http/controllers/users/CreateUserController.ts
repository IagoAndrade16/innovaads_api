import { Request, Response } from "express";
import { Controller } from "../../../../core/Controller";
import { inject, injectable } from "tsyringe";
import * as yup from 'yup';
import { ValidationsUtils } from "../../../../core/ValidationUtils";
import { CreateUserUseCase } from "../../../../domain/modules/users/usecases/CreateUserUseCase";
import { PhoneNumber } from "../../../../domain/modules/users/entities/value-objects/PhoneNumber";

@injectable()
export class CreateUserController implements Controller {
  constructor (
    @inject(CreateUserUseCase)
    private readonly usecase: CreateUserUseCase,
  ) {}

  private bodySchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required().test('validate-email', 'Invalid email', (email) => ValidationsUtils.validateEmail(email)),
    password: yup.string().required().min(6),
    phone: yup.string().required().test('phone', 'invalid-phone-number-format', (value) => {
			return PhoneNumber.isValid(value);
		}),
  })

  async handle(req: Request, res: Response): Promise<void> {
    const body = await this.bodySchema.validate(req.body, { abortEarly: false });

    await this.usecase.execute({
      ...body,
    });

    res.status(201).send();
  }
}