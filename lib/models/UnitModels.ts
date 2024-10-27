// spectralnext/lib/models/UnitModels.ts

import type { UploadFile } from 'antd/es/upload/interface';

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
  uploads: any;
  color: null;
  profileImage: any;
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
  quote?: string; // Ajout de la propriété quote
  color?: string; // Ajout de la propriété color
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
  story: string;
  bio: string;
  quote: string; // Ajout de la propriété quote
  color: string; // Ajout de la propriété color
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
  quote?: string; // Ajout de la propriété quote
  color?: string; // Ajout de la propriété color
  isPublished?: boolean;
  type?: UnitType;
  profileImage?: FileType;
  headerImage?: FileType;
  footerImage?: FileType;
  gallery?: UploadFile[];
  galleryImagesToDelete?: string[];
  classIds?: string[];
}
