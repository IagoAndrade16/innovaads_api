export type PagarmeCardPayment = {
	payment_method: 'credit_card';
	credit_card: {
		installments: number;
		card_id: string;
	}
}
