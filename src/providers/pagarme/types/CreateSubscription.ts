export type CreateSubscriptionInput = {
  customer_id: string;
  installments: number;
  description: string;
  card_id: string;
  pricing_scheme: {
    scheme_type: 'unit' | 'package' | 'volume' | 'tier';
    price: number;
    minimum_price: number;
  };
  quantity: number;
  code?: string;
  payment_method?: 'credit_card' | 'boleto' | 'debit_card';
  currency?: 'BRL';
  start_at?: string;
  interval?: SubscriptionInterval;
  minimum_price?: number;
  interval_count: number;
  billing_type?: SubscriptionBillingType;
  statement_descriptor?: string;
}

export type SubscriptionInterval = 'day' | 'week' | 'month' | 'year';
export type SubscriptionBillingType = 'prepaid' | 'postpaid' | 'exact_day';

export type CreateSubscriptionOutput = {
  status: 'SUCCESS' | 'FAILED'
  subscription_id?: string;
}