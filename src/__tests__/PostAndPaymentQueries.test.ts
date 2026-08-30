import axios from 'axios';
import {
  fetchPosts,
  fetchPostById,
  createPost,
  updatePost,
  deletePost,
} from '@/lib/queries/PostQueries';
import { fetchSubscriptionInfo, cancelSubscription } from '@/lib/queries/PaymentQueries';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const API = 'http://localhost:5000';

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  mockedAxios.get.mockResolvedValue({ data: {} });
  mockedAxios.post.mockResolvedValue({ data: {} });
  mockedAxios.patch.mockResolvedValue({ data: {} });
  mockedAxios.delete.mockResolvedValue({ data: {} });
});

describe('PostQueries — optional auth on public reads', () => {
  it('sends no Authorization header when the visitor is anonymous', async () => {
    await fetchPosts();
    expect(mockedAxios.get).toHaveBeenCalledWith(`${API}/posts`, { headers: {} });
  });

  it('sends the bearer token so a logged-in EDITOR also sees drafts/scheduled posts', async () => {
    localStorage.setItem('access_token', 'editor-tok');

    await fetchPostById(5);

    expect(mockedAxios.get).toHaveBeenCalledWith(`${API}/posts/5`, {
      headers: { Authorization: 'Bearer editor-tok' },
    });
  });
});

describe('PostQueries — create/update payloads', () => {
  it('createPost puts isPublished, publishedAt, type and array ids into the FormData', async () => {
    await createPost(
      {
        title: 'T',
        intro: 'I',
        type: 'SCIENCE',
        isPublished: false,
        publishedAt: '2030-01-01T00:00:00.000Z',
        unitIds: ['3', '4'],
      } as any,
      'admin-tok',
    );

    const [url, body, config] = mockedAxios.post.mock.calls[0];
    expect(url).toBe(`${API}/posts`);
    const fd = body as FormData;
    expect(fd.get('isPublished')).toBe('false');
    expect(fd.get('publishedAt')).toBe('2030-01-01T00:00:00.000Z');
    expect(fd.get('type')).toBe('SCIENCE');
    expect(fd.getAll('unitIds[]')).toEqual(['3', '4']);
    expect((config as any).headers.Authorization).toBe('Bearer admin-tok');
    expect((config as any).headers['Content-Type']).toBe('multipart/form-data');
  });

  it('updatePost only appends the fields that are actually provided', async () => {
    await updatePost(9, { title: 'New title' } as any, 'admin-tok');

    const fd = mockedAxios.patch.mock.calls[0][1] as FormData;
    expect(fd.get('title')).toBe('New title');
    expect(fd.get('intro')).toBeNull();
    expect(fd.get('type')).toBeNull();
    expect(mockedAxios.patch.mock.calls[0][0]).toBe(`${API}/posts/9`);
  });

  it('deletePost sends the bearer token', async () => {
    await deletePost(9, 'admin-tok');
    expect(mockedAxios.delete).toHaveBeenCalledWith(`${API}/posts/9`, {
      headers: { Authorization: 'Bearer admin-tok' },
    });
  });
});

describe('PaymentQueries', () => {
  it('reads the subscription with the bearer token', async () => {
    localStorage.setItem('access_token', 'tok');

    await fetchSubscriptionInfo();

    expect(mockedAxios.get).toHaveBeenCalledWith(`${API}/payment/subscription`, {
      headers: { Authorization: 'Bearer tok' },
    });
  });

  it('cancels the subscription via POST with an empty body and the bearer token', async () => {
    localStorage.setItem('access_token', 'tok');

    await cancelSubscription();

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${API}/payment/cancel-subscription`,
      null,
      { headers: { Authorization: 'Bearer tok' } },
    );
  });
});
