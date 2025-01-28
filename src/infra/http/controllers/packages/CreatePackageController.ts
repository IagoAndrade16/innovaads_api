 
import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';
import { CreatePackageUseCase } from '../../../../domain/modules/packages/usecases/CreatePackageUseCase';
import { TypeOrmPackagesMapper } from '../../../database/typeorm/mappers/TypeOrmPackagesMapper';
import { Controller } from '../../../../core/Controller';

// TODO: unit tests
@injectable()
export class CreatePackageController implements Controller{
  private bodySchema = yup.object().shape({
  	package: yup.object().shape({
  		name: yup.string().required(),
  		description: yup.string().required(),
  		price: yup.number().required(),
  	}).required(),
  	details: yup.array().of(
  		yup.object().shape({
  			description: yup.string().required(),
  		}),
  	).required(),
  });

  constructor(
    @inject(CreatePackageUseCase)
    private usecase: CreatePackageUseCase,
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
  	const body = await this.bodySchema.validate(req.body, {
  		abortEarly: false,
  	});

  	const usecaseRes = await this.usecase.execute({
  		package: body.package,
  		details: body.details,
  		userId: req.user!.id,
  	});

  	res.status(201).json(TypeOrmPackagesMapper.toHTTP(usecaseRes.package));
  }
}
