import axios from 'axios';
import { UserModel, CreateUserModel, UpdateUserModel } from '../models/UserModels';
import { RegisterUserModel } from '../models/AuthModels';

// Utilisation des variables d'environnement pour définir la base URL
const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL;

// Fonction pour récupérer tous les utilisateurs
export const fetchUsers = async (token: string): Promise<RegisterUserModel[]> => {
  const response = await axios.get<RegisterUserModel[]>(`${BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Fonction pour récupérer un utilisateur par ID
export const fetchUserById = async (id: number, token: string): Promise<UserModel> => {
  const response = await axios.get<UserModel>(`${BASE_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Fonction pour créer un nouvel utilisateur
export const createUser = async (data: CreateUserModel, token: string): Promise<UserModel> => {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('lastName', data.lastName);
  if (data.address) formData.append('address', data.address);
  formData.append('email', data.email);
  if (data.phone) formData.append('phone', data.phone);
  formData.append('status', data.status);
  formData.append('pseudo', data.pseudo);
  formData.append('password', data.password);
  formData.append('role', data.role);

  if (data.profileImage) formData.append('profileImage', data.profileImage as File);

  const response = await axios.post<UserModel>(`${BASE_URL}/users`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Fonction pour mettre à jour un utilisateur
export const updateUser = async (
  id: number,
  data: UpdateUserModel,
  token: string,
): Promise<UserModel> => {
  const formData = new FormData();

  if (data.name) formData.append('name', data.name);
  if (data.lastName) formData.append('lastName', data.lastName);
  if (data.address) formData.append('address', data.address);
  if (data.email) formData.append('email', data.email);
  if (data.phone) formData.append('phone', data.phone);
  if (data.status) formData.append('status', data.status);
  if (data.pseudo) formData.append('pseudo', data.pseudo);
  if (data.password) formData.append('password', data.password);
  if (data.role) formData.append('role', data.role);

  if (data.profileImage) formData.append('profileImage', data.profileImage as File);

  const response = await axios.put<UserModel>(`${BASE_URL}/users/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Fonction pour supprimer un utilisateur
export const deleteUser = async (id: number, token: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
