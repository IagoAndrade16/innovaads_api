export type ObtainChargeOutput = {
	id: string;
	status: ChargeStatus;
	amountInCents: number;
}

export type ChargeStatus = 'canceled' | 'pending' | 'processing' | 'failed' | 'overpaid' | 'underpaid' | 'paid' | 'chargedback';
