import { ChargeStatus } from './ObtainChargeOutput';
import { PagarmeOrderItem } from './PagarmeOrderItem';
import { PagarmePixPayment } from './PagarmePixPayment';

export type CreateOrderWithPixInput = {
	customer_id: string;
	items: PagarmeOrderItem[];
	payments: PagarmePixPayment[];
}

export type CreateOrderWithPixOutput = {
	status: PixOrderStatus;
	chargeId: string;
	qrCodeData?: string;
	qrCodeUrl?: string;
}

export type PixOrderStatus =
| 'pending'
| 'waiting_payment'
| 'paid'
| 'pending_refuded'
| 'refunded'
| 'with_error'
| 'failed';
