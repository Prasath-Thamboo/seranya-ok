import axios from 'axios';
import { NotificationModel } from '@/lib/models/NotificationModels';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
});

export const fetchNotifications = async (): Promise<NotificationModel[]> => {
  const response = await axios.get<NotificationModel[]>(`${BASE_URL}/notifications`, {
    headers: authHeader(),
  });
  return response.data;
};

export const fetchUnreadNotificationCount = async (): Promise<number> => {
  const response = await axios.get<number>(`${BASE_URL}/notifications/unread-count`, {
    headers: authHeader(),
  });
  return response.data;
};

export const markNotificationAsRead = async (id: number): Promise<void> => {
  await axios.patch(`${BASE_URL}/notifications/${id}/read`, null, { headers: authHeader() });
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await axios.patch(`${BASE_URL}/notifications/read-all`, null, { headers: authHeader() });
};
