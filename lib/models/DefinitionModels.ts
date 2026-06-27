export interface DefinitionModel {
  id: number;
  term: string;
  definition: string;
  category?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
