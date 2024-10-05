// ClassModels.ts

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
  uploads: UploadModel[];
  profileImage?: string | null;
  headerImage?: string | null;
  footerImage?: string | null;
  gallery?: string[] | null;
  galleryUploadIds?: number[] | null; // Ajout de cette ligne
  color?: string | null;
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
  uploads: UploadModel[]; // Ajout de cette ligne
  profileImage?: string | null;
  headerImage?: string | null;
  footerImage?: string | null;
  gallery?: string[] | null;
  galleryUploadIds?: number[] | null;
}

export interface UploadModel {
  id: number;
  path: string;
  type: UploadType;
}

export enum UploadType {
  GALERY = 'GALERY',
  PROFILEIMAGE = 'PROFILEIMAGE',
  HEADERIMAGE = 'HEADERIMAGE',
  FOOTERIMAGE = 'FOOTERIMAGE',
}
