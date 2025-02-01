import { PagarmePhone } from './PagarmePhone';

export type PagarmeCustomer = {
	type: 'individual' | 'company';
	name: string;
	email: string;
	document_type: 'CPF' | 'CNPJ' | 'PASSPORT';
	document: string;
	phones: {
		mobile_phone: PagarmePhone;
	}
}
