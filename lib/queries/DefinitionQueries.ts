import axios from 'axios';
import { DefinitionModel } from '../models/DefinitionModels';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';

export const fetchPublishedDefinitions = async (): Promise<DefinitionModel[]> => {
  const response = await axios.get<DefinitionModel[]>(`${BASE_URL}/definitions/published`);
  return response.data;
};

export const fetchDefinitions = async (): Promise<DefinitionModel[]> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get<DefinitionModel[]>(`${BASE_URL}/definitions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createDefinition = async (
  data: Omit<DefinitionModel, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<DefinitionModel> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.post<DefinitionModel>(`${BASE_URL}/definitions`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateDefinition = async (
  id: number,
  data: Partial<DefinitionModel>,
): Promise<DefinitionModel> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.patch<DefinitionModel>(`${BASE_URL}/definitions/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteDefinition = async (id: number): Promise<void> => {
  const token = localStorage.getItem('access_token');
  await axios.delete(`${BASE_URL}/definitions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
