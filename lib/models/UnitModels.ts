// Types pour les images
export type FileType = File | string;

// Enum pour le type d'unité (réplique du type utilisé dans Prisma)
export enum UnitType {
  UNIT = 'UNIT',
  CHAMPION = 'CHAMPION',
}

// Interface pour l'utilisateur associé à une unité
export interface User {
  id: number;
  pseudo: string;
}

// Interface pour les classes associées à une unité
export interface ClassModel {
  id: string;
  title: string;
}

// Interface pour les uploads associés
export interface Upload {
  id: number;
  path: string;
  type: string;
}

// Interface pour le modèle d'unité (données complètes)
export interface UnitModel {
  id: number;
  title: string;
  intro: string;
  subtitle?: string;
  story?: string;
  bio?: string;
  isPublished: boolean;
  type: UnitType;
  createdAt: Date;
  updatedAt: Date;
  profileImage?: string;
  headerImage?: string;
  footerImage?: string;
  gallery: string[];
  users: { user: User }[];
  classes: ClassModel[];
  galleryUploadIds?: number[];
  uploads?: Upload[]; // Ajout de la propriété uploads
}

// Interface pour le modèle de création d'unité
export interface CreateUnitModel {
  title: string;
  intro: string;
  subtitle?: string;
  story?: string;
  bio?: string;
  isPublished?: boolean;
  type: UnitType;
  profileImage?: FileType;
  headerImage?: FileType;
  footerImage?: FileType;
  gallery?: FileType[];
  classIds?: string[];
}

// Interface pour le modèle de mise à jour d'une unité
export interface UpdateUnitModel {
  title?: string;
  intro?: string;
  subtitle?: string;
  story?: string;
  bio?: string;
  isPublished?: boolean;
  type?: UnitType;
  profileImage?: FileType;
  headerImage?: FileType;
  footerImage?: FileType;
  gallery?: FileType[];
  galleryImagesToDelete?: string[];
  classIds?: string[];
}
