// lib/models/ClassModels.ts

export enum UploadType {
  GALERY = 'GALERY',
  PROFILEIMAGE = 'PROFILEIMAGE',
  HEADERIMAGE = 'HEADERIMAGE',
  FOOTERIMAGE = 'FOOTERIMAGE',
}

export interface UploadModel {
  id: number;
  path: string;
  type: UploadType;
}

export interface UnitModel {
  id: number;
  title: string;
  intro: string;
  subtitle?: string | null;
  story?: string | null;
  bio?: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  uploads: UploadModel[]; // Assurez-vous que cette ligne est présente
  profileImage?: string | null;
  headerImage?: string | null;
  footerImage?: string | null;
  gallery?: string[] | null;
  galleryUploadIds?: number[] | null;
}

export interface ClassModel {
  id: string;
  title: string;
  intro: string;
  subtitle?: string | null;
  story?: string | null;
  bio?: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  units: UnitModel[];
  uploads: UploadModel[]; // Assurez-vous que cette ligne est présente
  profileImage?: string | null;
  headerImage?: string | null;
  footerImage?: string | null;
  gallery?: string[] | null;
  galleryUploadIds?: number[] | null;
  color?: string | null;
}
