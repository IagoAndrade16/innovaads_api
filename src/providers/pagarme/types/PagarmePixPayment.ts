export type PagarmePixPayment = {
	payment_method: 'pix';
	Pix: {
		expires_in: number;
		additional_information: PagarmePixInfo[];
	}
}

export type PagarmePixInfo = {
	name: string;
	value: string;
}
