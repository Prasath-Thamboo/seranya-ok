import axios from 'axios';
import {
  loginUser,
  logoutUser,
  registerUser,
  generateResetToken,
  resetPassword,
  fetchCurrentUser,
} from '@/lib/queries/AuthQueries';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const API = 'http://localhost:5000';

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe('loginUser', () => {
  it('stores a string token as-is under access_token', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { token: 'jwt-string' } });

    await loginUser({ email: 'a@b.c', password: 'x' });

    expect(mockedAxios.post).toHaveBeenCalledWith(`${API}/auth/login`, {
      email: 'a@b.c',
      password: 'x',
    });
    expect(localStorage.getItem('access_token')).toBe('jwt-string');
  });

  it('unwraps a { access_token } object token', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { token: { access_token: 'jwt-nested' } } });

    await loginUser({ email: 'a@b.c', password: 'x' });

    expect(localStorage.getItem('access_token')).toBe('jwt-nested');
  });

  it('throws and stores nothing when the response has no token', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {} });

    await expect(loginUser({ email: 'a@b.c', password: 'x' })).rejects.toThrow('Login failed');
    expect(localStorage.getItem('access_token')).toBeNull();
  });
});

describe('logoutUser', () => {
  it('does nothing when there is no token', async () => {
    await logoutUser();
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('calls the logout endpoint with the bearer token then clears it', async () => {
    localStorage.setItem('access_token', 'tok');
    mockedAxios.post.mockResolvedValueOnce({ data: {} });

    await logoutUser();

    expect(mockedAxios.post).toHaveBeenCalledWith(`${API}/auth/logout`, null, {
      headers: { Authorization: 'Bearer tok' },
    });
    expect(localStorage.getItem('access_token')).toBeNull();
  });
});

describe('registerUser', () => {
  it('posts a multipart FormData carrying the provided fields', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { message: 'ok' } });

    await registerUser({
      email: 'a@b.c',
      password: 'secret12',
      pseudo: 'alice',
      name: 'Alice',
    } as any);

    const [url, body, config] = mockedAxios.post.mock.calls[0];
    expect(url).toBe(`${API}/auth/register`);
    expect(body).toBeInstanceOf(FormData);
    expect((body as FormData).get('email')).toBe('a@b.c');
    expect((body as FormData).get('pseudo')).toBe('alice');
    expect((body as FormData).get('name')).toBe('Alice');
    expect((config as any).headers['Content-Type']).toBe('multipart/form-data');
  });
});

describe('reset password endpoints', () => {
  it('generateResetToken hits /auth/generate-reset-token', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {} });
    await generateResetToken('a@b.c');
    expect(mockedAxios.post).toHaveBeenCalledWith(`${API}/auth/generate-reset-token`, {
      email: 'a@b.c',
    });
  });

  it('resetPassword hits /auth/reset-password', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {} });
    await resetPassword({ newPassword: 'n', resetToken: 't' } as any);
    expect(mockedAxios.post).toHaveBeenCalledWith(`${API}/auth/reset-password`, {
      newPassword: 'n',
      resetToken: 't',
    });
  });
});

describe('fetchCurrentUser', () => {
  it('throws immediately when no token is stored', async () => {
    await expect(fetchCurrentUser()).rejects.toThrow('No token found');
  });

  it('sends the bearer token and returns the user payload', async () => {
    localStorage.setItem('access_token', 'tok');
    mockedAxios.get.mockResolvedValueOnce({ data: { id: 1, role: 'ADMIN' } });

    await expect(fetchCurrentUser()).resolves.toEqual({ id: 1, role: 'ADMIN' });
    expect(mockedAxios.get).toHaveBeenCalledWith(`${API}/auth/me`, {
      headers: { Authorization: 'Bearer tok' },
    });
  });

  it('clears the token on a 401 and rethrows', async () => {
    localStorage.setItem('access_token', 'tok');
    mockedAxios.get.mockRejectedValueOnce({ response: { status: 401 } });
    (mockedAxios.isAxiosError as unknown as jest.Mock) = jest.fn(() => true);

    await expect(fetchCurrentUser()).rejects.toBeDefined();
    expect(localStorage.getItem('access_token')).toBeNull();
  });
});
