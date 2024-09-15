// classQueries.ts

import axios from 'axios';
import { ClassModel } from '@/lib/models/ClassModels';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';

// Fonction pour récupérer toutes les classes
export const fetchClasses = async (): Promise<ClassModel[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/classes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
};

// Fonction pour récupérer une classe par ID
export const fetchClassById = async (id: string): Promise<ClassModel> => {
  try {
    const response = await axios.get(`${BASE_URL}/classes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching class:', error);
    throw error;
  }
};

// Fonction pour créer une nouvelle classe
export const createClass = async (classData: FormData): Promise<ClassModel> => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Token not found');

    const response = await axios.post(`${BASE_URL}/classes`, classData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error creating class:', error);
    throw error;
  }
};

// Fonction pour mettre à jour une classe
export const updateClass = async (id: string, classData: FormData): Promise<ClassModel> => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Token not found');

    const response = await axios.patch(`${BASE_URL}/classes/${id}`, classData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating class:', error);
    throw error;
  }
};

// Fonction pour supprimer une classe
export const deleteClass = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Token not found');

    await axios.delete(`${BASE_URL}/classes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error deleting class:', error);
    throw error;
  }
};
