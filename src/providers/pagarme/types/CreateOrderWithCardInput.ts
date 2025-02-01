import { PagarmeCardPayment } from './PagarmeCardPayment';
import { PagarmeOrderItem } from './PagarmeOrderItem';

export type CreateOrderWithCardInput = {
	customer_id: string;
	items: PagarmeOrderItem[];
	payments: PagarmeCardPayment[];
}

export type CreateOrderWithCardOutput = {
	chargeId: string | null;
}
