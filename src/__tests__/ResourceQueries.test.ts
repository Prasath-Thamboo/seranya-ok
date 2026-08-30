import axios from 'axios';
import {
  fetchComments,
  fetchAllComments,
  createComment,
  updateComment,
  deleteComment,
} from '@/lib/queries/CommentQueries';
import {
  fetchNotifications,
  fetchUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '@/lib/queries/NotificationQueries';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const API = 'http://localhost:5000';
const AUTH = { headers: { Authorization: 'Bearer tok' } };

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  localStorage.setItem('access_token', 'tok');
  mockedAxios.get.mockResolvedValue({ data: [] });
  mockedAxios.post.mockResolvedValue({ data: {} });
  mockedAxios.patch.mockResolvedValue({ data: {} });
  mockedAxios.delete.mockResolvedValue({ data: {} });
});

describe('CommentQueries', () => {
  it('fetchComments forwards the resource filters as query params (no auth needed)', async () => {
    await fetchComments({ postId: 3, classId: 'c-uuid' });

    expect(mockedAxios.get).toHaveBeenCalledWith(`${API}/comments`, {
      params: { postId: 3, classId: 'c-uuid' },
    });
  });

  it('fetchAllComments hits the moderation route with the bearer token', async () => {
    await fetchAllComments();
    expect(mockedAxios.get).toHaveBeenCalledWith(`${API}/comments/all`, AUTH);
  });

  it('createComment posts the body with the bearer token', async () => {
    await createComment({ content: 'hi', postId: 3 } as any);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${API}/comments`,
      { content: 'hi', postId: 3 },
      AUTH,
    );
  });

  it('updateComment / deleteComment target the id-scoped route', async () => {
    await updateComment(12, { content: 'edit' } as any);
    await deleteComment(12);
    expect(mockedAxios.patch).toHaveBeenCalledWith(`${API}/comments/12`, { content: 'edit' }, AUTH);
    expect(mockedAxios.delete).toHaveBeenCalledWith(`${API}/comments/12`, AUTH);
  });
});

describe('NotificationQueries', () => {
  it('all reads/writes carry the bearer token', async () => {
    await fetchNotifications();
    await fetchUnreadNotificationCount();
    await markNotificationAsRead(7);
    await markAllNotificationsAsRead();

    expect(mockedAxios.get).toHaveBeenCalledWith(`${API}/notifications`, AUTH);
    expect(mockedAxios.get).toHaveBeenCalledWith(`${API}/notifications/unread-count`, AUTH);
    expect(mockedAxios.patch).toHaveBeenCalledWith(`${API}/notifications/7/read`, null, AUTH);
    expect(mockedAxios.patch).toHaveBeenCalledWith(`${API}/notifications/read-all`, null, AUTH);
  });

  it('reflects the token currently in localStorage at call time', async () => {
    localStorage.setItem('access_token', 'rotated');

    await fetchNotifications();

    expect(mockedAxios.get).toHaveBeenCalledWith(`${API}/notifications`, {
      headers: { Authorization: 'Bearer rotated' },
    });
  });
});
