import { Request, Response } from "express";
import { Controller } from "../../../core/Controller";
import * as yup from "yup";
import { inject, injectable } from "tsyringe";
import { FetchDailyTrendsUseCase } from "../usecases/FetchDailyTrendsUseCase";

@injectable()
export class FetchDailyTrendsController implements Controller {
  constructor (
    @inject(FetchDailyTrendsUseCase)
    private readonly fetchDailyTrendsUseCase: FetchDailyTrendsUseCase,
  ) {}

  private querySchema = yup.object().shape({
    trendsDate: yup.string().optional().matches(/^\d{4}-\d{2}-\d{2}$/, 'trendsDate must match the following pattern: YYYY-MM-DD'),
    geoLocation: yup.string().optional().default('BR'),
  });

  async handle(req: Request, res: Response): Promise<void> {
    const { trendsDate, geoLocation } = await this.querySchema.validate(req.query, { abortEarly: false });
    const { id: userId } = req.user!;
    
    const fetchDailyTrendsRes = await this.fetchDailyTrendsUseCase.execute({
      trendsDate,
      geoLocation,
      userId,
    });

    res.status(200).send({
      result: fetchDailyTrendsRes,
    })
  }
}