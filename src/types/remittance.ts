export interface Country {
  id: number;
  name: string;
  currency: string;
  rate: string;
  image?: string;
  status: number;
}

export interface DeliveryMethod {
  id: number;
  name: string;
  image?: string;
  status: number;
}

export interface DeliveryService {
  id: number;
  name: string;
  delivery_method_id: number;
  country_id: number;
}

export interface SendMoneyCalculation {
  sending_amount: number;
  sending_currency: string;
  recipient_amount: number;
  recipient_currency: string;
  rate: number;
  fixed_charge: number;
  percent_charge: number;
  total_charge: number;
  total_debit: number;
}

export interface SendMoneyPayload {
  sending_country_id: number;
  recipient_country_id: number;
  delivery_method_id: number;
  service_id?: number;
  recipient_id?: number;
  recipient_name?: string;
  recipient_mobile?: string;
  recipient_account?: string;
  payment_type: number; // 1=Wallet, 2=Direct Gateway
  wallet_id?: number;
  sending_amount: number;
  pin: string;
  purpose?: string;
  source_of_fund?: string;
}

export interface SendMoneyRecord {
  id: number;
  mtcn_number: string;
  trx: string;
  user_id: number;
  sending_amount: string;
  sending_currency: string;
  sending_charge: string;
  recipient_amount: string;
  recipient_currency: string;
  rate: string;
  recipient_name?: string;
  recipient_country?: string;
  payment_status: number; // 0=Initiate, 1=Success, 2=Pending, 3=Reject
  status: number; // 0=Initiate, 1=Completed, 2=Pending, 3=Refunded
  payout_channel?: string;
  api_status?: string;
  created_at: string;
}
