import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import ContactPage from '@/app/contact/ContactClient';
import { NotificationProvider } from '@/components/notifications/NotificationProvider';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const renderContactPage = () =>
  render(
    <NotificationProvider>
      <ContactPage />
    </NotificationProvider>,
  );

describe('ContactPage', () => {
  beforeEach(() => {
    mockedAxios.post.mockReset();
  });

  it('renders the contact form', () => {
    renderContactPage();

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sujet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Envoyer/i })).toBeInTheDocument();
  });

  it('submits the form with valid input', async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockResolvedValueOnce({ data: {} });
    renderContactPage();

    await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/Sujet/i), 'Problème technique');
    await user.type(screen.getByLabelText(/Message/i), 'Mon message de test');
    await user.click(screen.getByRole('button', { name: /Envoyer/i }));

    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/mailer/contact'),
      expect.objectContaining({
        email: 'test@example.com',
        subject: 'Problème technique',
        message: 'Mon message de test',
      }),
    );
  });

  it('shows a validation error and does not submit when fields are empty', async () => {
    const user = userEvent.setup();
    renderContactPage();

    await user.click(screen.getByRole('button', { name: /Envoyer/i }));

    expect(await screen.findAllByText('Requis')).not.toHaveLength(0);
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });
});
