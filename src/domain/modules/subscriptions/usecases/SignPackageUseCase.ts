import { inject, singleton } from 'tsyringe';

import { UseCase } from '../../../../core/UseCase';
import { PagarmeProvider, pagarmeProviderAlias } from '../../../../providers/pagarme/PagarmeProvider';
import { DomainError } from '../../../errors/DomainError';
import { ResourceNotFoundError } from '../../../errors/ResourceNotFoundError';
import { UserNotFoundError } from '../../../errors/UserNotFoundError';
import { PackagesRepository, packagesRepositoryAlias } from '../../packages/repositories/PackagesRepository';
import { UsersRepository, usersRepositoryAlias } from '../../users/repositories/UsersRepository';
import { Cpf } from '../entities/value-objects/Cpf';
import { PhoneNumber } from '../../users/entities/value-objects/PhoneNumber';
import { Document } from '../entities/value-objects/Document';
import { SubscriptionsRepository, subscriptionsRepositoryAlias } from '../repositories/SubscriptionsRepository';

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

		@inject(subscriptionsRepositoryAlias)
		private readonly subscriptionsRepository: SubscriptionsRepository,
	) {}

	async execute(input: SignPackageUseCaseInput): Promise<SignPackageUseCaseOutput> {
		const user = await this.usersRepository.findById(input.userId);

		if (!user) {
			throw new UserNotFoundError();
		}

    const choosedPackage = await this.packagesRepository.findById(input.packageId);

    if (!choosedPackage) {
      throw new ResourceNotFoundError('PACKAGE_NOT_FOUND');
    }

		const userPhoneNumber = PhoneNumber.parse(user.phone);
		const document = Document.parse(input.payerData.document);

		const { payerData } = input;
		const customer = await this.pagarmeProvider.createCustomer({
			type: 'individual',
			name: user.name,
			email: user.email,
			document: document.onlyNumbers(),
			document_type: Cpf.isValid(payerData.document) ? 'CPF' : 'CNPJ',
			phones: {
				mobile_phone: {
					country_code: userPhoneNumber.countryCode,
					area_code: userPhoneNumber.areaCode,
					number: userPhoneNumber.number,
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

		const subscription = await this.pagarmeProvider.createSubscription({
			customer_id: customer.id,
			description: choosedPackage.name,
			installments: 1,
			interval_count: 1,
			card_id: card.id,
			pricing_scheme: {
				minimum_price: choosedPackage.priceInCents,
				price: choosedPackage.priceInCents,
				scheme_type: 'unit',
			},
			minimum_price: choosedPackage.priceInCents,
			quantity: 1,
		});

		if(subscription.status === 'FAILED') {
			throw new DomainError(400, 'PAYMENT_FAILED');
		}

		await Promise.all([
			this.usersRepository.updateById(user.id, {
				packageId: choosedPackage.id,
				subscriptionId: subscription.subscription_id,
				subscriptionStatus: 'active'
			}),
			this.subscriptionsRepository.insert({
				packageId: choosedPackage.id,
				subscriptionId: subscription.subscription_id!,
				userId: user.id,
			}),
		])
	}
}
