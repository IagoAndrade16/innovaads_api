import { Request, Response } from "express";
import { Controller } from "../../../../core/Controller";
import { inject, injectable } from "tsyringe";
import * as yup from 'yup';
import { ValidationsUtils } from "../../../../core/ValidationUtils";
import { UpdateUserUseCase } from "../../../../domain/modules/users/usecases/UpdateUserUseCase";
import { PhoneNumber } from "../../../../domain/modules/users/entities/value-objects/PhoneNumber";


@injectable()
export class UpdateUserController implements Controller {
  constructor (
    @inject(UpdateUserUseCase)
    private readonly usecase: UpdateUserUseCase,
  ) {}

  private bodySchema = yup.object().shape({
    name: yup.string().optional(),
    email: yup.string().email().optional().test('validate-email', 'Invalid email', (email) => email ? ValidationsUtils.validateEmail(email) : true),
    phone: yup.string().required().test('phone', 'invalid-phone-number-format', (value) => {
      return PhoneNumber.isValid(value);
    }),
  })

  async handle(req: Request, res: Response): Promise<void> {
    const body = await this.bodySchema.validate(req.body, { abortEarly: false });

    await this.usecase.execute({
      userId: req.user!.id,
      email: body.email,
      name: body.name,
      phone: body.phone,
    });

    res.status(204).send();
  }
}