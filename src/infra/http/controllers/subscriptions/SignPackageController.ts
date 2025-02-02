import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import * as yup from 'yup';
import { Controller } from "../../../../core/Controller";
import { SignPackageUseCase } from "../../../../domain/modules/subscriptions/usecases/SignPackageUseCase";
import { Utils } from "../../../../core/Utils";
import { Document } from "../../../../domain/modules/subscriptions/entities/value-objects/Document";

@injectable()
export class SignPackageController implements Controller {
  constructor(
    @inject(SignPackageUseCase)
    private readonly usecase: SignPackageUseCase,
  ) {}

  private paymentDataSchema = yup.object().shape({
    number: yup.string().required(),
    holderName: yup.string().required(),
    expMonth: yup.string().required(),
    expYear: yup.string().required(),
    cvv: yup.string().required(),
    billingAddress: yup.object().shape({
      zipCode: yup.string().required(),
      street: yup.string().required(),
      number: yup.string().required(),
      neighborhood: yup.string().required(),
      city: yup.string().required(),
      state: yup.string().required(),
      country: yup.string().required(),
      complement: yup.string()
    })
  })

  private payerDataSchema = yup.object().shape({
    document: yup.string().required().test('is-valid', 'document is not valid CPF or CNPJ', (value) => {
      return Document.isValid(Utils.clean(value));
    }),
  });

  private bodySchema = yup.object().shape({
    packageId: yup.string().required(),
    payerData: this.payerDataSchema,
    paymentData: this.paymentDataSchema,
  })

  async handle(req: Request, res: Response): Promise<void> {
    const body = await this.bodySchema.validate(req.body, { abortEarly: false });

    await this.usecase.execute({
      packageId: body.packageId,
      payerData: body.payerData,
      paymentData: body.paymentData,
      userId: req.user!.id,
    });

    res.status(201).send();
  }
}