 
import moment from 'moment';
import { inject, injectable } from 'tsyringe';
import { urlJoin } from 'url-join-ts';

import { Environment } from '../../../core/Enviroment';
import { ApiHeaders, ApiProviderAxios, apiProviderAxiosAlias } from '../../api/ApiProviderAxios';
import { ApiResponse } from '../../api/implementations/ApiProviderAxiosImpl';
import { PagarmeProvider } from '../PagarmeProvider';
import { CreateCardOutput } from '../types/CreateCardTypes';
import { CreateClientOutput } from '../types/CreateClientTypes';
import { CreateOrderWithCardInput, CreateOrderWithCardOutput } from '../types/CreateOrderWithCardInput';
import { DeleteCardStatus } from '../types/DeleteCardStatus';
import { ObtainCardInput } from '../types/ObtainCardInput';
import { ObtainCardOutput } from '../types/ObtainCardOutput';
import { ObtainChargeOutput } from '../types/ObtainChargeOutput';
import { PagarmeCreditCard } from '../types/PagarmeCreditCard';
import { PagarmeCustomer } from '../types/PagarmeCustomer';
import { CreateSubscriptionInput, CreateSubscriptionOutput } from '../types/CreateSubscription';
import { PagarmeDeleteSubscriptionOutput } from '../types/DeleteSubscription';

@injectable()
export class PagarmeProviderImpl implements PagarmeProvider {
	constructor(
    @inject(apiProviderAxiosAlias)
    private apiProvider: ApiProviderAxios,
	) {}

	async createCustomer(customer: PagarmeCustomer): Promise<CreateClientOutput> {
		const customerRes = await this.post('customers', customer);

		if (customerRes.statusCode !== 200) {
			console.log(`${moment().format('DD/MM/YYYY HH:mm:ss')} - customer creation failed: ${JSON.stringify(customerRes.data, null, 2)}`);
			return null;
		}

		return { id: customerRes.data.id };
	}

	async createCard(customerId: string, card: PagarmeCreditCard): Promise<CreateCardOutput | null> {
		const params = {
			...card,
			billing_address: {
				...card.billing_address,
				line_1: `${card.billing_address.number},${card.billing_address.street},${card.billing_address.neighborhood}`,
				line_2: card.billing_address.complement,
			},
		};
		const cardRes = await this.post(`customers/${customerId}/cards`, params);

		if (cardRes.statusCode !== 200) {
			console.log(`${moment().format('DD/MM/YYYY HH:mm:ss')} - card creation failed: ${JSON.stringify(cardRes.data, null, 2)}`);
			return null;
		}

		return {
			id: cardRes.data.id,
			brand: cardRes.data.brand,
			lastFourDigits: cardRes.data.last_four_digits,
			exp_month: cardRes.data.exp_month,
			exp_year: cardRes.data.exp_year,
		};
	}

	async createOrderWithCard(order: CreateOrderWithCardInput): Promise<CreateOrderWithCardOutput> {
		const params = {
			...order,
			items: order.items.map((item) => ({
				...item,
				amount: item.amountInCents,
			})),
		};

		const orderRes = await this.post('orders', params);

		if (orderRes.statusCode !== 200 || orderRes.data.status !== 'paid') {
			console.log(`${moment().format('DD/MM/YYYY HH:mm:ss')} - card declined: ${JSON.stringify(orderRes.data, null, 2)}`);
			return { chargeId: null };
		}

		console.log(`${moment().format('DD/MM/YYYY HH:mm:ss')} - card approved: ${JSON.stringify(orderRes.data, null, 2)}`);

		return { chargeId: orderRes.data.charges[0].id };
	}

	async obtainCard(input: ObtainCardInput): Promise<ObtainCardOutput | null> {
		const res = await this.get(`customers/${input.customerId}/cards/${input.cardId}`);

		if (res.statusCode !== 200) {
			console.log(`${moment().format('DD/MM/YYYY HH:mm:ss')} - card obtain failed: ${JSON.stringify(res.data, null, 2)}`);
			return null;
		}

		return {
			brand: res.data.brand,
			lastFourDigits: res.data.last_four_digits,
			exp_month: res.data.exp_month,
			exp_year: res.data.exp_year,
		};
	}

	async obtainCharge(chargeId: string): Promise<ObtainChargeOutput | null> {
		const res = await this.get(`charges/${chargeId}`);


		if (res.statusCode !== 200) {
			console.log(`${moment().format('DD/MM/YYYY HH:mm:ss')} - charge obtain failed: ${JSON.stringify(res.data, null, 2)}`);
			return null;
		}

		// console.log('charge obtained: ', JSON.stringify(res.data, null, 2));

		return {
			id: chargeId,
			status: res.data.status,
			amountInCents: res.data.amount,
		};
	}

	async deleteCard(customerId: string, cardId: string): Promise<DeleteCardStatus> {
		const res = await this.delete(`customers/${customerId}/cards/${cardId}`, {});

		if (res.statusCode !== 200) {
			console.log(`${moment().format('DD/MM/YYYY HH:mm:ss')} - subscription creation failed: ${JSON.stringify(res.data, null, 2)}`);
			return 'FAILED';
		}

		return 'SUCCESS';
	}

	async createSubscription(order: CreateSubscriptionInput): Promise<CreateSubscriptionOutput> {
		const res = await this.post(`/subscriptions`, {
			...order,
			installments: 1,
			payment_method: 'credit_card',
			currency: 'BRL',
			interval: 'month',
			interval_count: 1,
			billing_type: 'prepaid',
		});

		console.log(`${moment().format('DD/MM/YYYY HH:mm:ss')} - create subscription res: ${JSON.stringify(res.data, null, 2)}`);
		
		if (res.statusCode !== 200) {
			return {
				status: 'FAILED',
			}
		}

		return {
			status: 'SUCCESS',
			subscription_id: res.data.id,
		}
	}

	async deleteSubscription(subscriptionId: string): Promise<PagarmeDeleteSubscriptionOutput> {
		const res = await this.delete(`/subscriptions/${subscriptionId}`, {});

		if (res.statusCode !== 200) {
			console.log(`${moment().format('DD/MM/YYYY HH:mm:ss')} - subscription deletion failed: ${JSON.stringify(res.data, null, 2)}`);
			return {
				status: 'FAILED',
			}
		}

		return {
			status: 'SUCCESS',
		}
	}

	private async get(relativeUrl: string): Promise<ApiResponse> {
		return this.apiProvider.get(this.getUrl(relativeUrl), this.getHeaders());
	}

	private async post(relativeUrl: string, params: object): Promise<ApiResponse> {
		return this.apiProvider.post(this.getUrl(relativeUrl), params, this.getHeaders());
	}

	private async delete(relativeUrl: string, params: object): Promise<ApiResponse> {
		return this.apiProvider.delete(this.getUrl(relativeUrl), params, this.getHeaders());
	}

	private getUrl(relativeUrl: string): string {
		return urlJoin('https://api.pagar.me/core/v5/', relativeUrl);
	}

	private getHeaders(): ApiHeaders {
		const apiKey = Environment.vars.PAGARME_API_KEY;
		const authHeader = `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;

		return { Authorization: authHeader };
	}
}
