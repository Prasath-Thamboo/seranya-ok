import axios from 'axios';
import { getAccessToken } from './AuthQueries';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';

export interface SubscriptionInfo {
  subscribed: boolean;
  status?: string;
  currentPeriodEnd?: number | null;
  cancelAtPeriodEnd?: boolean;
  amount?: number | null;
  currency?: string | null;
  interval?: string | null;
}

export const fetchSubscriptionInfo = async (): Promise<SubscriptionInfo> => {
  const { data } = await axios.get<SubscriptionInfo>(`${BASE_URL}/payment/subscription`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  return data;
};

export const cancelSubscription = async (): Promise<void> => {
  await axios.post(
    `${BASE_URL}/payment/cancel-subscription`,
    null,
    { headers: { Authorization: `Bearer ${getAccessToken()}` } },
  );
};
