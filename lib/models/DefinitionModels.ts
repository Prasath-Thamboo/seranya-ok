export interface DefinitionModel {
  id: number;
  term: string;
  definition: string;
  category?: string;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
