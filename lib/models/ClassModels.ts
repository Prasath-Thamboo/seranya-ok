// classModel.ts

export interface ClassModel {
  id: string;
  title: string;
  intro: string;
  subtitle?: string;
  story?: string;
  bio?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  units: UnitModel[];
  uploads: UploadModel[];
  profileImage?: string | null;  // Accepter null
  headerImage?: string | null;   // Accepter null
  footerImage?: string | null;   // Accepter null
  gallery?: string[] | null;     // Accepter null
}

export interface UnitModel {
  id: number;
  title: string;
  intro: string;
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
