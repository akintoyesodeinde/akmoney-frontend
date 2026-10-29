export interface Wallet {
  id: number;
  user_id: number;
  currency: string;
  country_id: number;
  country_name?: string;
  country_flag?: string;
  balance: string;
  is_default: number;
  status: number;
  created_at: string;
}

export interface WalletExchangePayload {
  from_wallet_id: number;
  to_wallet_id: number;
  amount: number;
  pin: string;
}

export interface WalletTransferPayload {
  sender_wallet_id: number;
  receiver_identifier: string; // email, username, or phone
  amount: number;
  pin: string;
}

export interface WalletDepositInitPayload {
  wallet_id: number;
  amount: number;
  payment_method: string;
}
