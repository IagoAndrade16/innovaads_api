export type CreateSubscriptionInput = {
  customer_id: string;
  installments: number;
  description: string;
  pricing_schema: {
    scheme_type: 'unit' | 'package' | 'volume' | 'tier';
    price: number;
    minimum_price: number;
  };
  quantity: number;
  code?: string;
  payment_method?: 'credit_card' | 'boleto' | 'debit_card';
  currency?: 'BRL';
  start_at?: string;
  interval?: 'day' | 'week' | 'month' | 'year';
  minimum_price?: number;
  interval_count: number;
  billing_type?: 'prepaid' | 'postpaid' | 'exact_day';
  statement_descriptor?: string;
}

export type CreateSubscriptionOutput = {
  status: 'SUCCESS' | 'FAILED'
  subscription_id?: string;
}