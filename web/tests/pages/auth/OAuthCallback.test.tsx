import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { OAuthCallback } from '../../../src/pages/auth/OAuthCallback';
import { LocaleProvider } from '../../../src/contexts';

vi.mock('../../../src/contexts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../src/contexts')>();
  return {
    ...actual,
    useAuth: vi.fn(() => ({
      loginWithOAuth: vi.fn().mockResolvedValue(undefined),
      status: 'idle',
      user: null,
      anonId: null,
      showWelcome: false,
      login: vi.fn(),
      register: vi.fn(),
      verify: vi.fn(),
      resendCode: vi.fn(),
      logout: vi.fn(),
      startOAuthLogin: vi.fn(),
      createAnonymous: vi.fn(),
      refreshAuth: vi.fn(),
    })),
  };
});

const renderWithRouter = (
  initialEntries: string[] = ['/oauth/google/callback'],
  initialIndex = 0
) => {
  return render(
    <LocaleProvider>
      <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
        <Routes>
          <Route path="/oauth/:provider/callback" element={<OAuthCallback />} />
        </Routes>
      </MemoryRouter>
    </LocaleProvider>
  );
};

describe('OAuthCallback', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'location', {
      value: { ...originalLocation, search: '' },
      writable: true,
    });
  });

  it('renders processing title', () => {
    window.location.search = '?preview=1';
    renderWithRouter(['/oauth/google/callback?preview=1']);
    expect(
      screen.getByText(/completing sign-in|завершаем вход/i)
    ).toBeInTheDocument();
  });

  it('renders processing message in success box when in preview mode', () => {
    window.location.search = '?preview=1';
    renderWithRouter(['/oauth/google/callback?preview=1']);
    expect(
      screen.getByText(/completing oauth sign-in|завершаем oauth вход/i)
    ).toBeInTheDocument();
  });

  it('shows error and Back button when code/state are missing', async () => {
    window.location.search = '';
    renderWithRouter(['/oauth/google/callback']);

    await waitFor(() => {
      expect(
        screen.getByText(/missing|code|state|отсутствует/i)
      ).toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', { name: /back|назад/i });
    expect(backButton).toBeInTheDocument();
  });

  it('navigates to /auth when Back button is clicked', async () => {
    window.location.search = '';
    render(
      <LocaleProvider>
        <MemoryRouter initialEntries={['/oauth/google/callback']}>
          <Routes>
            <Route path="/oauth/:provider/callback" element={<OAuthCallback />} />
            <Route path="/auth" element={<div data-testid="auth-page">Auth</div>} />
          </Routes>
        </MemoryRouter>
      </LocaleProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/missing|code|state|отсутствует/i)
      ).toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', { name: /back|назад/i });
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    });
  });

  it('renders card with correct structure', () => {
    window.location.search = '?preview=1';
    const { container } = renderWithRouter(['/oauth/google/callback?preview=1']);
    const card = container.querySelector('.rounded-lg.border');
    expect(card).toBeInTheDocument();
    expect(container.querySelector('h2')).toBeInTheDocument();
  });
});
