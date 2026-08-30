import { render, screen, waitFor } from '@testing-library/react';
import ProtectedRoute from '@/middleware/ProtectedRoute';
import { UserRole } from '@/lib/models/UserModels';
import { fetchCurrentUser } from '@/lib/queries/AuthQueries';
import { NotificationProvider } from '@/components/notifications/NotificationProvider';

jest.mock('@/lib/queries/AuthQueries');
const mockedFetchCurrentUser = fetchCurrentUser as jest.Mock;

const push = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

const renderGuarded = (allowedRoles: UserRole[], fallbackPath?: string) =>
  render(
    <NotificationProvider>
      <ProtectedRoute allowedRoles={allowedRoles} fallbackPath={fallbackPath}>
        <div>secret content</div>
      </ProtectedRoute>
    </NotificationProvider>,
  );

beforeEach(() => {
  jest.clearAllMocks();
});

it('renders the children when the current user has an allowed role', async () => {
  mockedFetchCurrentUser.mockResolvedValue({ role: UserRole.ADMIN });

  renderGuarded([UserRole.ADMIN, UserRole.EDITOR]);

  expect(await screen.findByText('secret content')).toBeInTheDocument();
  expect(push).not.toHaveBeenCalled();
});

it('redirects an authenticated but wrong-role user to the fallback path, silently', async () => {
  mockedFetchCurrentUser.mockResolvedValue({ role: UserRole.EDITOR });

  renderGuarded([UserRole.ADMIN], '/admin/posts');

  await waitFor(() => expect(push).toHaveBeenCalledWith('/admin/posts'));
  expect(screen.queryByText('secret content')).not.toBeInTheDocument();
  // an EDITOR bounced off an ADMIN page is normal navigation → no "Accès refusé"
  expect(screen.queryByText('Accès refusé')).not.toBeInTheDocument();
});

it('shows "Accès refusé" and redirects when a plain USER hits an admin route', async () => {
  mockedFetchCurrentUser.mockResolvedValue({ role: UserRole.USER });

  renderGuarded([UserRole.ADMIN, UserRole.EDITOR], '/admin/posts');

  expect(await screen.findByText('Accès refusé')).toBeInTheDocument();
  expect(push).toHaveBeenCalledWith('/admin/posts');
});

it('redirects to /auth/login when the user is not authenticated at all', async () => {
  mockedFetchCurrentUser.mockRejectedValue(new Error('No token found'));

  renderGuarded([UserRole.ADMIN]);

  await waitFor(() => expect(push).toHaveBeenCalledWith('/auth/login'));
  expect(await screen.findByText('Connexion requise')).toBeInTheDocument();
});
