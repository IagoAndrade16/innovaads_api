import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { Controller } from "../../../../core/Controller";
import { FetchCreativesUseCase } from "../../../../domain/modules/ads/usecases/FetchCreativesUseCase";
import * as yup from "yup";
import { AdActiveStatus } from "../../../../providers/facebook/@types/FacebookGraphApiAdsTypes";

@injectable()
export class FetchCreativesController implements Controller {
  constructor(
    @inject(FetchCreativesUseCase)
    private readonly usecase: FetchCreativesUseCase,
  ) {}

  private filtersSchema = yup.object().shape({
    ad_reached_countries: yup.string().required(),
    search_terms: yup.string().required(),
    ad_active_status: yup.string().optional().oneOf(Object.values(AdActiveStatus)),
  });

  private bodySchema = yup.object().shape({
    filters: this.filtersSchema.required(),
    nextRequestUrl: yup.string().optional(),
  });

  async handle(req: Request, res: Response): Promise<void> {
    const body = await this.bodySchema.validate(req.body, { abortEarly: false });

    const result = await this.usecase.execute({
      userId: req.user!.id,
      filters: body.filters,
      fields: {},
      nextRequestUrl: body.nextRequestUrl,
    });

    res.status(200).send(result);
  }
}