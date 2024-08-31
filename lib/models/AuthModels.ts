// Enum pour le rôle de l'utilisateur (réplique du type utilisé dans Prisma)
export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  USER = 'USER',
}

// Interface pour le modèle d'enregistrement d'utilisateur
// Interface pour le modèle d'enregistrement d'utilisateur
export interface RegisterUserModel {
  id: number;
  name?: string;
  lastName?: string;
  email: string;
  address?: string;
  password: string
  phone?: string;
  status?: string;
  pseudo: string;
  role?: UserRole;
  profileImage?: File | string;
  createdAt: string;
  updatedAt: string;
}

// Interface pour le modèle de connexion d'utilisateur
export interface LoginUserModel {
  email: string;
  password: string;
}

// Interface pour le modèle de réinitialisation de mot de passe
export interface ResetPasswordModel {
  email: string;
  newPassword: string;
  resetToken: string;
}

// Interface pour la réponse du serveur lors de l'authentification
export interface AuthResponse {
  message: string;
  token?: string;
  user?: RegisterUserModel; // Optionnel si vous souhaitez renvoyer l'utilisateur après l'enregistrement
}
