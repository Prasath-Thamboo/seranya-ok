export interface DefinitionModel {
  id: number;
  term: string;
  definition: string;
  category?: string;
  // Colonnes miroir EN : présentes seulement sur les réponses admin (sans ?lang).
  termEn?: string;
  definitionEn?: string;
  categoryEn?: string;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
