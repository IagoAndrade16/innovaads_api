 
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
import { GetSubscriptionOutput } from '../types/GetSubscriptionTypes';
import { Logger } from '../../../core/Logger';

@injectable()
export class PagarmeProviderImpl implements PagarmeProvider {
	constructor(
    @inject(apiProviderAxiosAlias)
    private apiProvider: ApiProviderAxios,

		@inject(Logger)
		private logger: Logger,
	) {}

	async createCustomer(customer: PagarmeCustomer): Promise<CreateClientOutput> {
		this.logger.info(`creating customer: ${JSON.stringify(customer, null, 2)}`);

		const customerRes = await this.post('customers', customer);

		this.logger.info(`customer creation res: ${JSON.stringify(customerRes.data, null, 2)}`);

		if (customerRes.statusCode !== 200) {
			this.logger.error(`customer creation failed: ${JSON.stringify(customerRes.data, null, 2)}`);
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

		this.logger.info(`creating card: ${JSON.stringify(params, null, 2)}`);

		const cardRes = await this.post(`customers/${customerId}/cards`, params);

		this.logger.info(`card creation res: ${JSON.stringify(cardRes.data, null, 2)}`);

		if (cardRes.statusCode !== 200) {
			this.logger.error(`card creation failed: ${JSON.stringify(cardRes.data, null, 2)}`);
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

		this.logger.info(`creating order: ${JSON.stringify(params, null, 2)}`);

		const orderRes = await this.post('orders', params);

		this.logger.info(`order creation res: ${JSON.stringify(orderRes.data, null, 2)}`);

		if (orderRes.statusCode !== 200 || orderRes.data.status !== 'paid') {
			this.logger.error(`card declined: ${JSON.stringify(orderRes.data, null, 2)}`);
			return { chargeId: null };
		}

		return { chargeId: orderRes.data.charges[0].id };
	}

	async obtainCard(input: ObtainCardInput): Promise<ObtainCardOutput | null> {
		const res = await this.get(`customers/${input.customerId}/cards/${input.cardId}`);

		if (res.statusCode !== 200) {
			this.logger.error(`card obtain failed: ${JSON.stringify(res.data, null, 2)}`);
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

		this.logger.info(`charge obtained: ${JSON.stringify(res.data, null, 2)}`);

		if (res.statusCode !== 200) {
			this.logger.error(`charge obtain failed: ${JSON.stringify(res.data, null, 2)}`);
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
			this.logger.error(`card deletion failed: ${JSON.stringify(res.data, null, 2)}`);
			return 'FAILED';
		}

		return 'SUCCESS';
	}

	async createSubscription(order: CreateSubscriptionInput): Promise<CreateSubscriptionOutput> {
		const params = {
			...order,
			installments: 1,
			payment_method: 'credit_card',
			currency: 'BRL',
			interval: 'month',
			interval_count: 1,
			billing_type: 'prepaid',
		}

		this.logger.info(`creating subscription: ${JSON.stringify(params, null, 2)}`);

		const res = await this.post(`/subscriptions`, params);

		this.logger.info(`create subscription res: ${JSON.stringify(res.data, null, 2)}`);
		
		if (res.statusCode !== 200) {
			this.logger.error(`create subscription res: ${JSON.stringify(res.data, null, 2)}`);
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
			this.logger.error(`subscription deletion failed: ${JSON.stringify(res.data, null, 2)}`);

			const isCanceled = res.data.message && res.data.message.includes('is canceled');
			if(isCanceled) {
				return {
					status: 'ALREADY_CANCELED',
				}
			}
			return {
				status: 'FAILED',
			}
		}

		return {
			status: 'SUCCESS',
		}
	}

	async getSubscription(subscriptionId: string): Promise<GetSubscriptionOutput | null> {
		const res = await this.get(`/subscriptions/${subscriptionId}`);

		this.logger.info(`get subscription res: ${JSON.stringify(res.data, null, 2)}`);

		if (res.statusCode !== 200) {
			this.logger.error(`subscription obtain failed: ${JSON.stringify(res.data, null, 2)}`);
			return null;
		}

		return res.data as GetSubscriptionOutput;
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
