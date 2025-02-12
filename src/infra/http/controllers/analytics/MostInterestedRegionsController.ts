import { Request, Response } from "express";
import { Controller } from "../../../../core/Controller";
import * as yup from "yup";
import { inject, injectable } from "tsyringe";
import { MostInterestedRegionsUseCase } from "../../../../domain/modules/analytics/usecases/MostInterestedRegionsUseCase";




@injectable()
export class MostInterestedRegionsController implements Controller {
  constructor (
    @inject(MostInterestedRegionsUseCase)
    private readonly mostInterestedRegionsUseCase: MostInterestedRegionsUseCase,
  ) {}

  private querySchema = yup.object().shape({
    keyword: yup.string().required(),
    startDate: yup.string().optional().matches(/^\d{4}-\d{2}-\d{2}$/, 'trendsDate must match the following pattern: YYYY-MM-DD'),
    endDate: yup.string().optional().matches(/^\d{4}-\d{2}-\d{2}$/, 'trendsDate must match the following pattern: YYYY-MM-DD'),
  });

  async handle(req: Request, res: Response): Promise<void> {
    const { keyword, startDate, endDate } = await this.querySchema.validate(req.query, { abortEarly: false });

    const mostInterestedRegions = await this.mostInterestedRegionsUseCase.execute({
      userId: req.user!.id,
      keyword,
      startDate,
      endDate,
    });

    res.status(200).send({
      result: mostInterestedRegions,
    });
  }
}