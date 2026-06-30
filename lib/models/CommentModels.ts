export interface CommentUser {
  id: number;
  pseudo: string;
  profileImage?: string | null;
  role: string;
}

export interface CommentModel {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  postId?: number | null;
  unitId?: number | null;
  classId?: string | null;
  tutorialId?: number | null;
  user: CommentUser;
  post?: { id: number; title: string } | null;
  unit?: { id: number; title: string } | null;
  class?: { id: string; title: string } | null;
  tutorial?: { id: number; title: string } | null;
}

export interface CreateCommentModel {
  content: string;
  postId?: number;
  unitId?: number;
  classId?: string;
  tutorialId?: number;
}

export interface UpdateCommentModel {
  content: string;
}
