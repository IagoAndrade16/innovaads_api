import { inject, singleton } from 'tsyringe';

import { UseCase } from '../../../../core/UseCase';
import { PagarmeProvider, pagarmeProviderAlias } from '../../../../providers/pagarme/PagarmeProvider';
import { DomainError } from '../../../errors/DomainError';
import { ResourceNotFoundError } from '../../../errors/ResourceNotFoundError';
import { UserNotFoundError } from '../../../errors/UserNotFoundError';
import { PackagesRepository, packagesRepositoryAlias } from '../../packages/repositories/PackagesRepository';
import { UsersRepository, usersRepositoryAlias } from '../../users/repositories/UsersRepository';
import { Cpf } from '../entities/value-objects/Cpf';

export type SignPackageUseCaseInput = {
	packageId: string;
	userId: string;
	payerData: PayerData;
	paymentData: PaymentData;
};

type PaymentData = {
	number: string;
	holderName: string;
	expMonth: string;
	expYear: string;
	cvv: string;
	billingAddress: {
		zipCode: string;
		street: string;
		number: string;
		neighborhood: string;
		city: string;
		state: string;
		country: string;
		complement?: string;
	};
}

type PayerData = {
	document: string;
}

export type SignPackageUseCaseOutput = void;

@singleton()
export class SignPackageUseCase implements UseCase<SignPackageUseCaseInput, SignPackageUseCaseOutput> {
	constructor(
		@inject(packagesRepositoryAlias)
		private readonly packagesRepository: PackagesRepository,

		@inject(usersRepositoryAlias)
		private readonly usersRepository: UsersRepository,

		@inject(pagarmeProviderAlias)
		private readonly pagarmeProvider: PagarmeProvider,
	) {}

	async execute(input: SignPackageUseCaseInput): Promise<SignPackageUseCaseOutput> {
		const user = await this.usersRepository.findById(input.userId);

		if (!user) {
			throw new UserNotFoundError();
		}

    const choosedPackage = await this.packagesRepository.findById(input.packageId);

    if (!choosedPackage) {
      throw new ResourceNotFoundError();
    }

		const { payerData } = input;
		const customer = await this.pagarmeProvider.createCustomer({
			type: 'individual',
			name: user.name,
			email: user.email,
			document: payerData.document,
			document_type: Cpf.isValid(payerData.document) ? 'CPF' : 'CNPJ',
			phones: {
				mobile_phone: {
					country_code: user.phone.substring(0, 2),
					area_code: user.phone.substring(2, 4),
					number: user.phone.substring(4),
				},
			},
		});

		if (!customer) {
			throw new DomainError(400, 'INVALID_CUSTOMER');
		}

		const { paymentData } = input;
		const card = await this.pagarmeProvider.createCard(customer.id, {
			number: paymentData.number,
			holder_name: paymentData.holderName,
			exp_month: paymentData.expMonth,
			exp_year: paymentData.expYear,
			cvv: paymentData.cvv,
			billing_address: {
				country: paymentData.billingAddress.country,
				city: paymentData.billingAddress.city,
				state: paymentData.billingAddress.state,
				zip_code: paymentData.billingAddress.zipCode,
				street: paymentData.billingAddress.street,
				number: paymentData.billingAddress.number,
				neighborhood: paymentData.billingAddress.neighborhood,
				complement: paymentData.billingAddress.complement,
			},
		});

		if (!card) {
			throw new DomainError(400, 'INVALID_CARD');
		}
	}
}
