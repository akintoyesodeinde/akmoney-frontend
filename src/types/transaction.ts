export interface Transaction {
  id: number;
  user_id: number;
  wallet_id?: number | null;
  currency?: string;
  amount: string;
  charge: string;
  post_balance: string;
  trx_type: '+' | '-';
  trx: string;
  details: string;
  remark: string;
  created_at: string;
}

export interface TransactionFilter {
  type?: 'all' | 'plus' | 'minus';
  currency?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
}
