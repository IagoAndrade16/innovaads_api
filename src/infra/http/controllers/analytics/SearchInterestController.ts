import { Request, Response } from "express";
import { Controller } from "../../../../core/Controller";
import { inject, injectable } from "tsyringe";
import * as yup from 'yup';
import { SearchInterestUseCase } from "../../../../domain/modules/analytics/usecases/SearchInterestUseCase";


@injectable()
export class SearchInterestController implements Controller {
  constructor (
    @inject(SearchInterestUseCase)
    private readonly searchInterestUseCase: SearchInterestUseCase,
  ) {}

  private querySchema = yup.object().shape({
    keyword: yup.string().required(),
    startDate: yup.string().optional().matches(/^\d{4}-\d{2}-\d{2}$/, 'trendsDate must match the following pattern: YYYY-MM-DD'),
    endDate: yup.string().optional().matches(/^\d{4}-\d{2}-\d{2}$/, 'trendsDate must match the following pattern: YYYY-MM-DD'),
  });
  
  async handle(req: Request, res: Response): Promise<void> {
    const query = await this.querySchema.validate(req.query, { abortEarly: false });
    const userId = req.user!.id;

    const interestRes = await this.searchInterestUseCase.execute({
      ...query,
      userId,
    });

    res.status(200).send({
      result: interestRes,
    })
  }
}