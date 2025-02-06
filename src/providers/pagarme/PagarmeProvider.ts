import { CreateCardOutput } from './types/CreateCardTypes';
import { CreateClientOutput } from './types/CreateClientTypes';
import { CreateOrderWithCardInput, CreateOrderWithCardOutput } from './types/CreateOrderWithCardInput';
import { CreateSubscriptionInput, CreateSubscriptionOutput } from './types/CreateSubscription';
import { DeleteCardStatus } from './types/DeleteCardStatus';
import { PagarmeDeleteSubscriptionOutput } from './types/DeleteSubscription';
import { GetSubscriptionOutput } from './types/GetSubscriptionTypes';
import { ObtainCardInput } from './types/ObtainCardInput';
import { ObtainCardOutput } from './types/ObtainCardOutput';
import { ObtainChargeOutput } from './types/ObtainChargeOutput';
import { PagarmeCreditCard } from './types/PagarmeCreditCard';
import { PagarmeCustomer } from './types/PagarmeCustomer';

export type PagarmeProvider = {
	createOrderWithCard(order: CreateOrderWithCardInput): Promise<CreateOrderWithCardOutput>;
	createCustomer(customer: PagarmeCustomer): Promise<CreateClientOutput>;
	createCard(customerId: string, card: PagarmeCreditCard): Promise<CreateCardOutput | null>;
	deleteCard(customerId: string, cardId: string): Promise<DeleteCardStatus>;
	obtainCard(input: ObtainCardInput): Promise<ObtainCardOutput | null>;
	obtainCharge(chargeId: string): Promise<ObtainChargeOutput | null>;
	createSubscription(order: CreateSubscriptionInput): Promise<CreateSubscriptionOutput>;
	deleteSubscription(subscriptionId: string): Promise<PagarmeDeleteSubscriptionOutput>;
	getSubscription(subscriptionId: string): Promise<GetSubscriptionOutput | null>;
}

export const pagarmeProviderAlias = 'PagarmeProvider';
