import api from './api';
import { Recipient, RecipientPayload } from '../types/recipient';

export const recipientService = {
  async getRecipients(): Promise<Recipient[]> {
    const response = await api.get<{ data: { recipients: { data: Recipient[] } } }>('/recipients');
    return response.data.data.recipients?.data || [];
  },

  async createRecipient(payload: RecipientPayload): Promise<Recipient> {
    const response = await api.post<{ data: { recipient: Recipient } }>('/recipients/save', payload);
    return response.data.data.recipient;
  },

  async deleteRecipient(id: number): Promise<void> {
    await api.post(`/recipients/delete/${id}`);
  },
};
