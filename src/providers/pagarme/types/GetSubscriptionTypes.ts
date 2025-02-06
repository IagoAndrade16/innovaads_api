import { SubscriptionInterval } from "./CreateSubscription";

export type GetSubscriptionOutput = {
  id: string;
  code: string;
  start_at: Date;
  interval: SubscriptionInterval;
  interval_count: number;
  billing_type: 'prepaid' | 'postpaid' | 'exact_day';
  current_cycle: {
    id: string;
    start_at: Date;
    end_at: Date;
    billing_at: Date;
    cycle: number;
    status: 'billed';
  },
  next_billing_at: Date;
  payment_method: 'credit_card' | 'boleto' | 'debit_card';
  currency: 'BRL';
  installments: number;
  minimum_price: number;
  status: 'active' | 'failed' | 'canceled';
  created_at: Date;
  updated_at: Date;
  canceled_at: Date;
  card: {
    id: string;
    first_six_digits: string;
    last_four_digits: string;
    brand: string;
    holder_name: string;
    exp_month: number;
    exp_year: number;
    status: 'active';
    type: 'credit' | 'debit';
    created_at: Date;
    updated_at: Date;
    billing_address: {
      street: string;
      number: string;
      complement: string;
      zip_code: string;
      neighborhood: string;
      city: string;
      state: string;
      country: string;
      line_1: string;
      line_2: string;
    }
  }
}