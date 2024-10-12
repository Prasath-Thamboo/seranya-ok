// spectralnext\lib\models\PostModels.ts

// Types pour les images
export type FileType = File | string;

// Enum pour le type de post (réplique du type utilisé dans Prisma)
export enum PostType {
  SCIENCE = 'SCIENCE',
  PHILO = 'PHILO',
  UNIVERS = 'UNIVERS',
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

// Interface pour le modèle de post (données complètes)
export interface PostModel {
  id: number;
  title: string;
  intro: string;
  subtitle?: string;
  content?: string;
  isPublished: boolean;
  type: PostType;
  createdAt: Date;
  updatedAt: Date;
  profileImage?: string;
  headerImage?: string;
  footerImage?: string;
  gallery: string[];
  units: UnitModel[];
  classes: ClassModel[];
  galleryUploadIds?: number[];
  uploads?: Upload[];
}

// Interface pour le modèle de création de post
export interface CreatePostModel {
  title: string;
  intro: string;
  subtitle?: string;
  content?: string;
  isPublished?: boolean;
  type: PostType;
  profileImage?: FileType;
  headerImage?: FileType;
  footerImage?: FileType;
  gallery?: FileType[];
  unitIds?: string[];
  classIds?: string[];
}

// Interface pour le modèle de mise à jour d'un post
export interface UpdatePostModel {
  title?: string;
  intro?: string;
  subtitle?: string;
  content?: string;
  isPublished?: boolean;
  type?: PostType;
  profileImage?: FileType;
  headerImage?: FileType;
  footerImage?: FileType;
  gallery?: FileType[];
  galleryImagesToDelete?: string[];
  unitIds?: string[];
  classIds?: string[];
}
