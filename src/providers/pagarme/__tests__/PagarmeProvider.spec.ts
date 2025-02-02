import { find } from '../../../core/DependencyInjection';
import { ApiProviderAxios, apiProviderAxiosAlias } from '../../api/ApiProviderAxios';

import { RandomProvider, randomProviderAlias } from '../../random/RandomProvider';
import { PagarmeProvider, pagarmeProviderAlias } from '../PagarmeProvider';
import { CreateOrderWithCardInput } from '../types/CreateOrderWithCardInput';
import { PagarmeCreditCard } from '../types/PagarmeCreditCard';
import { PagarmeCustomer } from '../types/PagarmeCustomer';

const pagarmeProvider = find<PagarmeProvider>(pagarmeProviderAlias);
const apiProvider = find<ApiProviderAxios>(apiProviderAxiosAlias);
const randomProvider = find<RandomProvider>(randomProviderAlias);

const sampleCustomer: PagarmeCustomer = {
	type: 'individual',
	name: 'John Doe',
	email: `${randomProvider.string(10, 'alphanumeric')}@gmail.com`,
	document: '67225544225', // valid cpf generated online
	document_type: 'CPF',
	phones: {
		mobile_phone: {
			country_code: '55',
			area_code: '11',
			number: '123456789',
		},
	},
};

const sampleCard: PagarmeCreditCard = {
	number: '4000000000000010',
	holder_name: 'Caroline Reinger',
	exp_year: '2028',
	exp_month: '12',
	cvv: '184',
	billing_address: {
		city: 'São Paulo',
		country: 'BR',
		zip_code: '12345678',
		street: 'Rua Teste',
		neighborhood: 'Bairro Teste',
		number: '123',
		state: 'SP',
	},
};

describe('createCustomer', () => {
	it('should create a client', async () => {
		const res = await pagarmeProvider.createCustomer(sampleCustomer);

		expect(res).toMatchObject({
			id: expect.any(String),
		});
	});

	it('should return null if pagarme return errors', async () => {
		jest.spyOn(apiProvider, 'post').mockResolvedValueOnce({
			statusCode: 400,
			data: {},
		});

		const res = await pagarmeProvider.createCustomer(sampleCustomer);

		expect(res).toBeNull();
	});
});

describe('createCard', () => {
	it('should create a card', async () => {
		const customer = await pagarmeProvider.createCustomer(sampleCustomer);

		const res = await pagarmeProvider.createCard(customer!.id, sampleCard);

		expect(res).toEqual({
			id: expect.any(String),
			brand: 'Visa',
			lastFourDigits: '0010',
			exp_month: 12,
			exp_year: 2028,
		});

	});

	it('should return null if pagarme return errors', async () => {
		jest.spyOn(apiProvider, 'post').mockResolvedValueOnce({
			statusCode: 400,
			data: {},
		});

		const res = await pagarmeProvider.createCard('cus_test', sampleCard);

		expect(res).toBeNull();
	});
});

describe('deleteCard', () => {
	it('should delete a card', async () => {
		const customer = await pagarmeProvider.createCustomer(sampleCustomer);
		const card = await pagarmeProvider.createCard(customer!.id, sampleCard);
		const res = await pagarmeProvider.deleteCard(customer!.id, card!.id);


		expect(res).toBe('SUCCESS');
	});

	it('should return FAILED if pagarme return errors', async () => {
		jest.spyOn(apiProvider, 'delete').mockResolvedValueOnce({
			statusCode: 400,
			data: {},
		});

		const res = await pagarmeProvider.deleteCard('cus_test', 'card_test');

		expect(res).toBe('FAILED');
	});
});

describe('createOrderWithCard', () => {
	it('should return chargeId null if pagarme return errors', async () => {
		jest.spyOn(apiProvider, 'post').mockResolvedValueOnce({
			statusCode: 400,
			data: {},
		});

		const res = await pagarmeProvider.createOrderWithCard({
			customer_id: 'cus_test',
			items: [],
			payments: [],
		});



		expect(res).toMatchObject({
			chargeId: null,
		});
	});

	it('should return chargeId null if pagarme return status != paid', async () => {
		jest.spyOn(apiProvider, 'post').mockResolvedValueOnce({
			statusCode: 200,
			data: {
				status: 'refused',
			},
		});

		const res = await pagarmeProvider.createOrderWithCard({
			customer_id: 'cus_test',
			items: [],
			payments: [],
		});

		expect(res).toMatchObject({
			chargeId: null,
		});
	});

	it('should create an order', async () => {
		const customer = await pagarmeProvider.createCustomer(sampleCustomer);
		const card = await pagarmeProvider.createCard(customer!.id, sampleCard);

		const order: CreateOrderWithCardInput = {
			customer_id: customer!.id,
			items: [
				{
					amountInCents: 100,
					description: 'Test',
					code: 'test',
					quantity: 1,
				},
			],
			payments: [
				{
					payment_method: 'credit_card',
					credit_card: {
						installments: 3,
						card_id: card!.id,
					},
				},
			],
		};

		const response = await pagarmeProvider.createOrderWithCard(order);

		expect(response).toMatchObject({
			chargeId: expect.any(String),
		});
	});
});

describe('obtainCard', () => {
	it('should return null if pagarme return errors', async () => {
		jest.spyOn(apiProvider, 'get').mockResolvedValueOnce({
			statusCode: 400,
			data: {},
		});

		const res = await pagarmeProvider.obtainCard({
			customerId: 'cus_test',
			cardId: 'card_test',
		});

		expect(res).toBeNull();
	});

	it('should obtain a card', async () => {
		const customer = await pagarmeProvider.createCustomer(sampleCustomer);
		const card = await pagarmeProvider.createCard(customer!.id, sampleCard);

		const res = await pagarmeProvider.obtainCard({
			customerId: customer!.id,
			cardId: card!.id,
		});

		expect(res).toMatchObject({
			lastFourDigits: sampleCard.number.slice(-4),
			brand: 'Visa',
			exp_month: 12,
			exp_year: 2028,
		});
	});
});

describe('obtainCharge', () => {
	it('should return null if pagarme return errors', async () => {
		jest.spyOn(apiProvider, 'get').mockResolvedValueOnce({
			statusCode: 400,
			data: {},
		});

		const res = await pagarmeProvider.obtainCharge('ch_test');

		expect(res).toBeNull();
	});

	it('should obtain a charge', async () => {
		const customer = await pagarmeProvider.createCustomer(sampleCustomer);
		const card = await pagarmeProvider.createCard(customer!.id, sampleCard);

		const order: CreateOrderWithCardInput = {
			customer_id: customer!.id,
			items: [
				{
					amountInCents: 100,
					description: 'Test',
					code: 'test',
					quantity: 1,
				},
			],
			payments: [
				{
					payment_method: 'credit_card',
					credit_card: {
						installments: 3,
						card_id: card!.id,
					},
				},
			],
		};

		const response = await pagarmeProvider.createOrderWithCard(order);

		const charge = await pagarmeProvider.obtainCharge(response.chargeId!);

		expect(charge).toMatchObject({
			id: response.chargeId,
			amountInCents: 100,
			status: 'paid',
		});
	});
});

describe('createSubscription', () => {
	it('should return FAILED if pagarme return errors', async () => {
		jest.spyOn(apiProvider, 'post').mockResolvedValueOnce({
			statusCode: 400,
			data: {},
		});

		const res = await pagarmeProvider.createSubscription({
			card_id: 'card_test',
			customer_id: 'cus_test',
			description: 'Test',
			installments: 1,
			interval_count: 1,
			pricing_scheme: {
				minimum_price: 100,
				price: 100,
				scheme_type: 'unit',
			},
			quantity: 1,
		});

		expect(res).toEqual({
			status: 'FAILED'
		});

		expect(apiProvider.post).toHaveBeenCalledTimes(1);
		expect(apiProvider.post).toHaveBeenCalledWith(expect.stringContaining('/subscriptions'), {
			card_id: 'card_test',
			customer_id: 'cus_test',
			description: 'Test',
			installments: 1,
			interval: 'month',
			interval_count: 1,
			payment_method: 'credit_card',
			pricing_scheme: {
				minimum_price: 100,
				price: 100,
				scheme_type: 'unit',
			},
			quantity: 1,
			billing_type: 'prepaid',
			currency: 'BRL'
		}, { Authorization: expect.any(String)});
	})

	it('should create a subscription', async () => {
		const customer = await pagarmeProvider.createCustomer(sampleCustomer);
		const card = await pagarmeProvider.createCard(customer!.id, sampleCard);

		const res = await pagarmeProvider.createSubscription({
			card_id: card!.id,
			customer_id: customer!.id,
			description: 'Test',
			installments: 1,
			interval_count: 1,
			pricing_scheme: {
				minimum_price: 100,
				price: 100,
				scheme_type: 'unit',
			},
			quantity: 1,
		});

		expect(res).toEqual({
			status: 'SUCCESS',
			subscription_id: expect.any(String),
		});
	});
})

describe('deleteSubscription', () => {
	it('should return FAILED if pagarme return errors', async () => {
		jest.spyOn(apiProvider, 'delete').mockResolvedValueOnce({
			statusCode: 400,
			data: {},
		});

		const res = await pagarmeProvider.deleteSubscription('sub_test');

		expect(res).toEqual({
			status: 'FAILED'
		});

		expect(apiProvider.delete).toHaveBeenCalledTimes(1);
		expect(apiProvider.delete).toHaveBeenCalledWith(expect.stringContaining('/subscriptions/sub_test'), {}, { Authorization: expect.any(String)});
	})

	it('should delete a subscription', async () => {
		const customer = await pagarmeProvider.createCustomer(sampleCustomer);
		const card = await pagarmeProvider.createCard(customer!.id, sampleCard);

		const subscription = await pagarmeProvider.createSubscription({
			card_id: card!.id,
			customer_id: customer!.id,
			description: 'Test',
			installments: 1,
			interval_count: 1,
			pricing_scheme: {
				minimum_price: 100,
				price: 100,
				scheme_type: 'unit',
			},
			quantity: 1,
		});

		const res = await pagarmeProvider.deleteSubscription(subscription.subscription_id!);

		expect(res).toEqual({
			status: 'SUCCESS'
		});
	});
})
