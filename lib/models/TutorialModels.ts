export interface TutorialModel {
  id: number;
  title: string;
  description?: string;
  // Colonnes miroir EN : présentes seulement sur les réponses admin (sans ?lang).
  titleEn?: string;
  descriptionEn?: string;
  // null quand l'utilisateur n'a pas accès à la vidéo (non abonné) : le backend
  // ne renvoie l'URL réelle qu'aux comptes autorisés, thumbnailUrl reste dispo.
  videoUrl: string | null;
  thumbnailUrl?: string | null;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
