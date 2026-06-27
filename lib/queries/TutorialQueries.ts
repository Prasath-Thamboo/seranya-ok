import axios from 'axios';
import { TutorialModel } from '../models/TutorialModels';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';

export const fetchPublishedTutorials = async (): Promise<TutorialModel[]> => {
  const response = await axios.get<TutorialModel[]>(`${BASE_URL}/tutorials/published`);
  return response.data;
};

export const fetchTutorials = async (): Promise<TutorialModel[]> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get<TutorialModel[]>(`${BASE_URL}/tutorials`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createTutorial = async (data: Omit<TutorialModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<TutorialModel> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.post<TutorialModel>(`${BASE_URL}/tutorials`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateTutorial = async (id: number, data: Partial<TutorialModel>): Promise<TutorialModel> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.patch<TutorialModel>(`${BASE_URL}/tutorials/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteTutorial = async (id: number): Promise<void> => {
  const token = localStorage.getItem('access_token');
  await axios.delete(`${BASE_URL}/tutorials/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
