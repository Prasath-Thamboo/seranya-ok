import axios from 'axios';
import { CommentModel, CreateCommentModel, UpdateCommentModel } from '@/lib/models/CommentModels';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
});

export const fetchComments = async (params: {
  postId?: number;
  unitId?: number;
  classId?: string;
  tutorialId?: number;
}): Promise<CommentModel[]> => {
  const response = await axios.get<CommentModel[]>(`${BASE_URL}/comments`, { params });
  return response.data;
};

export const fetchAllComments = async (): Promise<CommentModel[]> => {
  const response = await axios.get<CommentModel[]>(`${BASE_URL}/comments/all`, {
    headers: authHeader(),
  });
  return response.data;
};

export const createComment = async (data: CreateCommentModel): Promise<CommentModel> => {
  const response = await axios.post<CommentModel>(`${BASE_URL}/comments`, data, {
    headers: authHeader(),
  });
  return response.data;
};

export const updateComment = async (id: number, data: UpdateCommentModel): Promise<CommentModel> => {
  const response = await axios.patch<CommentModel>(`${BASE_URL}/comments/${id}`, data, {
    headers: authHeader(),
  });
  return response.data;
};

export const deleteComment = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/comments/${id}`, { headers: authHeader() });
};
