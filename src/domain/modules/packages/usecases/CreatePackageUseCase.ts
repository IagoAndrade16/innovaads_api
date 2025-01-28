import { inject, singleton } from 'tsyringe';

import { UseCase } from '../../../../core/UseCase';
import { ForbiddenError } from '../../../errors/ForbiddenError';
import { UserNotFoundError } from '../../../errors/UserNotFoundError';
import { UsersRepository, usersRepositoryAlias } from '../../users/repositories/UsersRepository';
import { Package } from '../entities/Package';
import { PackagesRepository, packagesRepositoryAlias } from '../repositories/PackagesRepository';

export type CreatePackageUseCaseInput = {
	package: {
		name: string;
		description: string;
		price: number;
	};
	userId: string;
	details: {
		description: string;
	}[];
};

export type CreatePackageUseCaseOutput = {
	package: Package;
};

@singleton()
export class CreatePackageUseCase implements UseCase<CreatePackageUseCaseInput, CreatePackageUseCaseOutput> {
	constructor(
		@inject(packagesRepositoryAlias)
		private readonly packagesRepository: PackagesRepository,

		@inject(usersRepositoryAlias)
		private readonly usersRepository: UsersRepository,
	) {}

	async execute(input: CreatePackageUseCaseInput): Promise<CreatePackageUseCaseOutput> {
		const user = await this.usersRepository.findById(input.userId);

		if (!user) {
			throw new UserNotFoundError();
		}

		if (user.role !== 'admin') {
			throw new ForbiddenError();
		}

		const insertedPackage = await this.packagesRepository.insert({
			description: input.package.description,
			name: input.package.name,
      price: input.package.price,
			details: input.details.map((detail) => ({
				description: detail.description,
			})),
		});

		return {
			package: insertedPackage,
		};
	}
}
