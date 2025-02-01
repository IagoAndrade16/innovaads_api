import { PagarmeCardBillingAddress } from './PagarmeCardBillingAddress';

export type PagarmeCreditCard = {
	holder_name: string;
	number: string;
	exp_month: string;
	exp_year: string;
	cvv: string;
	billing_address: PagarmeCardBillingAddress;
}
