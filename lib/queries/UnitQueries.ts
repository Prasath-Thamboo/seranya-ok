import axios from 'axios';
import { UnitModel, CreateUnitModel, UpdateUnitModel } from '../models/UnitModels';

// Utilisation des variables d'environnement pour définir la base URL
const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL;

// Fonction pour récupérer toutes les unités
export const fetchUnits = async (): Promise<UnitModel[]> => {
  const response = await axios.get<UnitModel[]>(`${BASE_URL}/units`);
  return response.data;
};

// Fonction pour récupérer une unité par ID
export const fetchUnitById = async (id: number): Promise<UnitModel> => {
  const response = await axios.get<UnitModel>(`${BASE_URL}/units/${id}`);
  return response.data;
};

// Fonction pour récupérer les unités associées à un utilisateur
export const fetchUnitsByUser = async (userId: number): Promise<UnitModel[]> => {
  const response = await axios.get<UnitModel[]>(`${BASE_URL}/units/user/${userId}`);
  return response.data;
};

// Fonction pour récupérer les unités associées à une classe
export const fetchUnitsByClass = async (classId: number): Promise<UnitModel[]> => {
  const response = await axios.get<UnitModel[]>(`${BASE_URL}/units/class/${classId}`);
  return response.data;
};

// Fonction pour créer une nouvelle unité
export const createUnit = async (data: CreateUnitModel, token: string): Promise<UnitModel> => {
  const formData = new FormData();

  formData.append('title', data.title);
  formData.append('intro', data.intro);
  if (data.subtitle) formData.append('subtitle', data.subtitle);
  if (data.story) formData.append('story', data.story);
  if (data.bio) formData.append('bio', data.bio);
  if (data.isPublished !== undefined) formData.append('isPublished', String(data.isPublished));
  formData.append('type', data.type);

  if (data.profileImage) formData.append('profileImage', data.profileImage as File);
  if (data.headerImage) formData.append('headerImage', data.headerImage as File);
  if (data.footerImage) formData.append('footerImage', data.footerImage as File);
  if (data.gallery && data.gallery.length > 0) {
    data.gallery.forEach((image, index) => {
      formData.append(`gallery[${index}]`, image as File);
    });
  }

  const response = await axios.post<UnitModel>(`${BASE_URL}/units`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Fonction pour mettre à jour une unité
export const updateUnit = async (
  id: number,
  data: UpdateUnitModel,
  token: string,
): Promise<UnitModel> => {
  const formData = new FormData();

  if (data.title) formData.append('title', data.title);
  if (data.intro) formData.append('intro', data.intro);
  if (data.subtitle) formData.append('subtitle', data.subtitle);
  if (data.story) formData.append('story', data.story);
  if (data.bio) formData.append('bio', data.bio);
  if (data.isPublished !== undefined) formData.append('isPublished', String(data.isPublished));
  if (data.type) formData.append('type', data.type);

  if (data.profileImage) formData.append('profileImage', data.profileImage as File);
  if (data.headerImage) formData.append('headerImage', data.headerImage as File);
  if (data.footerImage) formData.append('footerImage', data.footerImage as File);
  if (data.gallery && data.gallery.length > 0) {
    data.gallery.forEach((image, index) => {
      formData.append(`gallery[${index}]`, image as File);
    });
  }
  if (data.galleryImagesToDelete && data.galleryImagesToDelete.length > 0) {
    data.galleryImagesToDelete.forEach((imageId, index) => {
      formData.append(`galleryImagesToDelete[${index}]`, imageId);
    });
  }

  const response = await axios.patch<UnitModel>(`${BASE_URL}/units/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Fonction pour supprimer une unité
export const deleteUnit = async (id: number, token: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/units/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
