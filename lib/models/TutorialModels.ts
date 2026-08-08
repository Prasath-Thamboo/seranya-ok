export interface TutorialModel {
  id: number;
  title: string;
  description?: string;
  videoUrl: string;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
