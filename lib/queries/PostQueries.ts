// spectralnext/lib/queries/PostQueries.ts

import axios from 'axios';
import { PostModel, CreatePostModel, UpdatePostModel } from '../models/PostModels';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';

console.log('BASE_URL:', BASE_URL);

// Fonction pour récupérer tous les posts
export const fetchPosts = async (): Promise<PostModel[]> => {
  console.log('fetchPosts called');
  const response = await axios.get<PostModel[]>(`${BASE_URL}/posts`);
  return response.data;
};

// Fonction pour récupérer un post par ID
export const fetchPostById = async (id: number): Promise<PostModel> => {
  const response = await axios.get<PostModel>(`${BASE_URL}/posts/${id}`);
  return response.data;
};

// Fonction pour créer un nouveau post
export const createPost = async (data: CreatePostModel, token: string): Promise<PostModel> => {
  const formData = new FormData();

  formData.append('title', data.title);
  formData.append('intro', data.intro);
  if (data.subtitle) formData.append('subtitle', data.subtitle);
  if (data.content) formData.append('content', data.content);
  if (data.isPublished !== undefined) formData.append('isPublished', String(data.isPublished));
  formData.append('type', data.type);

  if (data.profileImage && typeof data.profileImage !== 'string') {
    formData.append('profileImage', data.profileImage as File);
  }
  if (data.headerImage && typeof data.headerImage !== 'string') {
    formData.append('headerImage', data.headerImage as File);
  }
  if (data.footerImage && typeof data.footerImage !== 'string') {
    formData.append('footerImage', data.footerImage as File);
  }
  if (data.gallery && data.gallery.length > 0) {
    Array.from(data.gallery).forEach((image) => {
      formData.append('gallery', image);
    });
  }

  if (data.unitIds && data.unitIds.length > 0) {
    data.unitIds.forEach((unitId) => {
      formData.append('unitIds[]', unitId); // Note: Append 'unitIds[]' pour indiquer un tableau
    });
  }

  if (data.classIds && data.classIds.length > 0) {
    data.classIds.forEach((classId) => {
      formData.append('classIds[]', classId); // Note: Append 'classIds[]' pour indiquer un tableau
    });
  }

  const response = await axios.post<PostModel>(`${BASE_URL}/posts`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Fonction pour mettre à jour un post existant
export const updatePost = async (
  id: number,
  data: UpdatePostModel,
  token: string,
): Promise<PostModel> => {
  const formData = new FormData();

  if (data.title) formData.append('title', data.title);
  if (data.intro) formData.append('intro', data.intro);
  if (data.subtitle) formData.append('subtitle', data.subtitle);
  if (data.content) formData.append('content', data.content);
  if (data.isPublished !== undefined) formData.append('isPublished', String(data.isPublished));
  if (data.type) formData.append('type', data.type);

  // Ajout des fichiers uploadés pour la mise à jour
  if (data.profileImage && typeof data.profileImage !== 'string') {
    formData.append('profileImage', data.profileImage as File);
  }
  if (data.headerImage && typeof data.headerImage !== 'string') {
    formData.append('headerImage', data.headerImage as File);
  }
  if (data.footerImage && typeof data.footerImage !== 'string') {
    formData.append('footerImage', data.footerImage as File);
  }

  // Gestion des images de galerie ajoutées
  if (data.gallery && data.gallery.length > 0) {
    Array.from(data.gallery).forEach((image) => {
      formData.append('gallery', image);
    });
  }

  // Gestion des images de galerie supprimées
  if (data.galleryImagesToDelete && data.galleryImagesToDelete.length > 0) {
    data.galleryImagesToDelete.forEach((imageId, index) => {
      formData.append(`galleryImagesToDelete[${index}]`, imageId);
    });
  }

  if (data.unitIds && data.unitIds.length > 0) {
    data.unitIds.forEach((unitId) => {
      formData.append('unitIds[]', unitId); // Note: Append 'unitIds[]' pour indiquer un tableau
    });
  }

  if (data.classIds && data.classIds.length > 0) {
    data.classIds.forEach((classId) => {
      formData.append('classIds[]', classId); // Note: Append 'classIds[]' pour indiquer un tableau
    });
  }

  const response = await axios.patch<PostModel>(`${BASE_URL}/posts/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Fonction pour supprimer un post
export const deletePost = async (id: number, token: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/posts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
