import api from './api';
import { Wallet, WalletExchangePayload, WalletTransferPayload } from '../types/wallet';
import { Transaction } from '../types/transaction';

export const walletService = {
  async getWallets(): Promise<Wallet[]> {
    const response = await api.get<{ data: { wallets: Wallet[] } }>('/wallets');
    return response.data.data.wallets || [];
  },

  async exchange(payload: WalletExchangePayload): Promise<void> {
    await api.post('/wallets/exchange', payload);
  },

  async transfer(payload: WalletTransferPayload): Promise<void> {
    await api.post('/wallets/transfer', payload);
  },

  async lookupReceiver(identifier: string): Promise<{ fullname: string; username: string }> {
    const response = await api.get<{ data: { receiver: { fullname: string; username: string } } }>(
      `/wallets/transfer/lookup?identifier=${encodeURIComponent(identifier)}`
    );
    return response.data.data.receiver;
  },

  async getTransactions(walletId?: number): Promise<Transaction[]> {
    const url = walletId ? `/wallets/${walletId}/transactions` : '/transactions';
    const response = await api.get<{ data: { transactions: { data: Transaction[] } } }>(url);
    return response.data.data.transactions?.data || [];
  },
};
