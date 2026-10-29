import api from './api';
import { Country, DeliveryMethod, DeliveryService, SendMoneyPayload, SendMoneyRecord } from '../types/remittance';

export const remittanceService = {
  async getCountries(): Promise<Country[]> {
    const response = await api.get<{ data: { countries: Country[] } }>('/countries');
    return response.data.data.countries || [];
  },

  async getDeliveryMethods(countryId: number): Promise<DeliveryMethod[]> {
    const response = await api.get<{ data: { delivery_methods: DeliveryMethod[] } }>(
      `/delivery-methods?country_id=${countryId}`
    );
    return response.data.data.delivery_methods || [];
  },

  async getServices(countryDeliveryMethodId: number): Promise<DeliveryService[]> {
    const response = await api.get<{ data: { services: DeliveryService[] } }>(
      `/services?country_delivery_method_id=${countryDeliveryMethodId}`
    );
    return response.data.data.services || [];
  },

  async sendMoney(payload: SendMoneyPayload): Promise<{ send_money: SendMoneyRecord }> {
    const response = await api.post<{ data: { send_money: SendMoneyRecord } }>('/send-money/save', payload);
    return response.data.data;
  },

  async getHistory(): Promise<SendMoneyRecord[]> {
    const response = await api.get<{ data: { send_money: { data: SendMoneyRecord[] } } }>('/send-money/history');
    return response.data.data.send_money?.data || [];
  },

  async trackTransfer(mtcn: string): Promise<SendMoneyRecord> {
    const response = await api.get<{ data: { transfer: SendMoneyRecord } }>(`/send-money/track/${mtcn}`);
    return response.data.data.transfer;
  },
};
