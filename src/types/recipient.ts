export interface Recipient {
  id: number;
  user_id: number;
  name: string;
  mobile: string;
  email?: string;
  address?: string;
  country_id: number;
  country_name?: string;
  country_delivery_method_id?: number;
  service_id?: number;
  service_name?: string;
  form_data?: Record<string, string>;
  created_at?: string;
}

export interface RecipientPayload {
  name: string;
  mobile: string;
  email?: string;
  country_id: number;
  service_id?: number;
  account_number?: string;
  bank_name?: string;
}
