// spectralnext/lib/models/PostModels.ts

// Import nécessaire pour les types de fichiers
// Importer uniquement si FileType est utilisé ailleurs, sinon supprimer
import type { UploadFile } from 'antd/es/upload/interface';

// Enum pour le type de post (réplique du type utilisé dans Prisma)
export enum PostType {
  SCIENCE = 'SCIENCE',
  PHILO = 'PHILO',
  UNIVERS = 'UNIVERS',
  REGION = 'REGION', // Ajouté
}

// Interface pour les unités associées à un post
export interface UnitModel {
  id: number;
  title: string;
  // Autres champs si nécessaire
}

// Interface pour les classes associées à un post
export interface ClassModel {
  id: string;
  title: string;
  // Autres champs si nécessaire
}

// Interface pour les uploads associés
export interface Upload {
  id: number;
  path: string;
  type: string;
}

// Interface pour la relation Post-Class
export interface PostClass {
  postId: number;
  classId: string;
  class: ClassModel;
}

// Interface pour le modèle de post (données complètes)
export interface PostModel {
  id: number;
  title: string;
  intro: string; // Utilisé au lieu de 'description'
  subtitle?: string;
  content?: string;
  isPublished: boolean;
  color?: string;
  type: PostType;
  createdAt: Date;
  updatedAt: Date;
  profileImage?: string;
  headerImage?: string;
  footerImage?: string;
  gallery: string[];
  units: UnitModel[];
  classes: ClassModel[];
  postClasses: PostClass[]; // Ajout de la relation PostClass
  uploads?: Upload[];
  galleryUploadIds?: number[];
}

// Interface pour le modèle de création de post
export interface CreatePostModel {
  title: string;
  intro: string;
  subtitle?: string;
  content?: string;
  color?: string;
  isPublished?: boolean;
  type: PostType;
  profileImage?: File | null;
  headerImage?: File | null;
  footerImage?: File | null;
  gallery?: FileList | null;
  unitIds?: string[];
  classIds?: string[];
}

// Interface pour le modèle de mise à jour de post
export interface UpdatePostModel {
  title?: string;
  intro?: string;
  subtitle?: string;
  content?: string;
  color?: string;
  isPublished?: boolean;
  type?: PostType;
  profileImage?: File | null;
  headerImage?: File | null;
  footerImage?: File | null;
  gallery?: File[] | null;
  galleryImagesToDelete?: string[];
  unitIds?: string[];
  classIds?: string[];
}
