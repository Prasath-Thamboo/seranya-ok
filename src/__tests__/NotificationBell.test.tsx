import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotificationBell from '@/components/dashboard/NotificationBell';
import * as Q from '@/lib/queries/NotificationQueries';

jest.mock('@/lib/queries/NotificationQueries');

const push = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

const mocked = Q as jest.Mocked<typeof Q>;

const notif = (over: Partial<Q.NotificationModel> = {}): any => ({
  id: 1,
  message: 'bob a commenté « Hello »',
  link: '/admin/discussions',
  isRead: false,
  createdAt: new Date().toISOString(),
  ...over,
});

beforeEach(() => {
  jest.clearAllMocks();
  mocked.fetchUnreadNotificationCount.mockResolvedValue(0);
  mocked.fetchNotifications.mockResolvedValue([]);
  mocked.markNotificationAsRead.mockResolvedValue(undefined);
  mocked.markAllNotificationsAsRead.mockResolvedValue(undefined);
});

it('shows the unread badge from the count endpoint on mount', async () => {
  mocked.fetchUnreadNotificationCount.mockResolvedValue(3);

  render(<NotificationBell />);

  expect(await screen.findByText('3')).toBeInTheDocument();
});

it('caps the badge display at "9+"', async () => {
  mocked.fetchUnreadNotificationCount.mockResolvedValue(42);

  render(<NotificationBell />);

  expect(await screen.findByText('9+')).toBeInTheDocument();
});

it('loads the list only when the panel is opened', async () => {
  const user = userEvent.setup();
  mocked.fetchNotifications.mockResolvedValue([notif()]);

  render(<NotificationBell />);
  expect(mocked.fetchNotifications).not.toHaveBeenCalled();

  await user.click(screen.getByLabelText('Notifications'));

  expect(await screen.findByText(/bob a commenté/)).toBeInTheDocument();
  expect(mocked.fetchNotifications).toHaveBeenCalledTimes(1);
});

it('marks a notification read and navigates to its link on click', async () => {
  const user = userEvent.setup();
  mocked.fetchUnreadNotificationCount.mockResolvedValue(1);
  mocked.fetchNotifications.mockResolvedValue([notif({ id: 7 })]);

  render(<NotificationBell />);
  await user.click(screen.getByLabelText('Notifications'));
  await user.click(await screen.findByText(/bob a commenté/));

  await waitFor(() => expect(mocked.markNotificationAsRead).toHaveBeenCalledWith(7));
  expect(push).toHaveBeenCalledWith('/admin/discussions');
});

it('marks everything read via the bulk action', async () => {
  const user = userEvent.setup();
  mocked.fetchNotifications.mockResolvedValue([notif({ id: 1 }), notif({ id: 2 })]);

  render(<NotificationBell />);
  await user.click(screen.getByLabelText('Notifications'));
  await user.click(await screen.findByText('Tout marquer comme lu'));

  expect(mocked.markAllNotificationsAsRead).toHaveBeenCalledTimes(1);
});
