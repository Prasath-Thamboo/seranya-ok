// Types pour les images
export type FileType = File | string;

// Enum pour le rôle de l'utilisateur (réplique du type utilisé dans Prisma)
export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  USER = 'USER',
}

// Interface pour le modèle d'utilisateur (données complètes)
export interface UserModel {
  id: number;
  name: string;
  lastName: string;
  address?: string;
  email: string;
  phone?: string;
  status: string;
  pseudo: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  profileImage?: string;
}

// Interface pour le modèle de création d'utilisateur
export interface CreateUserModel {
  name: string;
  lastName: string;
  address?: string;
  email: string;
  phone?: string;
  status: string;
  pseudo: string;
  password: string;
  role: UserRole;
  profileImage?: FileType;
}

// Interface pour le modèle de mise à jour d'un utilisateur
export interface UpdateUserModel {
  name?: string;
  lastName?: string;
  address?: string;
  email?: string;
  phone?: string;
  status?: string;
  pseudo?: string;
  password?: string;
  role?: UserRole;
  profileImage?: FileType;
}
