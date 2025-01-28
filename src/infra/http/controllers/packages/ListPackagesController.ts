import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { Controller } from "../../../../core/Controller";
import { ListPackagesUseCase } from "../../../../domain/modules/packages/usecases/ListPackagesUseCase";
import { TypeOrmPackagesMapper } from "../../../database/typeorm/mappers/TypeOrmPackagesMapper";

@injectable()
export class ListPackagesController implements Controller {
  constructor(
    @inject(ListPackagesUseCase)
    private readonly usecase: ListPackagesUseCase,
  ) {}

  async handle(_req: Request, res: Response): Promise<void> {
    const result = await this.usecase.execute();

    res.status(200).send({
      packages: result.packages.map(TypeOrmPackagesMapper.toHTTP),
    });
  }
}