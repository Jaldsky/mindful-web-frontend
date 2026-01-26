import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '../../../../src/components/layout';

const mockNavigate = vi.fn();
const mockOnClose = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' }),
  };
});

vi.mock('../../../../src/hooks', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const labels: Record<string, string> = {
        'navigation.home': 'Home',
        'navigation.analytics': 'Analytics',
        'navigation.profile': 'Profile',
      };
      return labels[key] || key;
    },
  }),
}));

vi.mock('../../../../src/contexts', () => ({
  useAuth: () => ({ status: 'anonymous' }),
}));

vi.mock('../../../../src/components/layout/header/Logo', () => ({
  Logo: () => <div>Logo</div>,
}));

vi.mock('../../../../src/components/layout/header/AuthButton', () => ({
  AuthButton: () => <div>AuthButton</div>,
}));

vi.mock('../../../../src/components/layout/header/HeaderControls', () => ({
  HeaderControls: () => <div>HeaderControls</div>,
}));

describe('Sidebar', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockOnClose.mockClear();
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('renders navigation items', () => {
    render(<Sidebar isOpen onClose={mockOnClose} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('shows overlay when open', () => {
    const { container } = render(<Sidebar isOpen onClose={mockOnClose} />);
    const overlay = container.querySelector('div[style*="rgba(0, 0, 0, 0.5)"]');
    expect(overlay).toBeInTheDocument();
  });

  it('does not render overlay when closed', () => {
    const { container } = render(<Sidebar isOpen={false} onClose={mockOnClose} />);
    const overlay = container.querySelector('div[style*="rgba(0, 0, 0, 0.5)"]');
    expect(overlay).not.toBeInTheDocument();
  });

  it('closes when overlay is clicked', () => {
    const { container } = render(<Sidebar isOpen onClose={mockOnClose} />);
    const overlay = container.querySelector('div[style*="rgba(0, 0, 0, 0.5)"]') as HTMLElement;
    expect(overlay).toBeInTheDocument();

    fireEvent.click(overlay);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('closes when close button is clicked', () => {
    render(<Sidebar isOpen onClose={mockOnClose} />);
    const closeButton = screen.getByRole('button', { name: /close menu/i });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('navigates on item click', () => {
    render(<Sidebar isOpen onClose={mockOnClose} />);
    const profileButton = screen.getByText('Profile').closest('button');
    expect(profileButton).toBeInTheDocument();

    if (profileButton) {
      fireEvent.click(profileButton);
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    }
  });

  it('locks body scroll when open', () => {
    render(<Sidebar isOpen onClose={mockOnClose} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when closed', () => {
    const { rerender } = render(<Sidebar isOpen onClose={mockOnClose} />);
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<Sidebar isOpen={false} onClose={mockOnClose} />);
    expect(document.body.style.overflow).toBe('');
  });
});
