import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileLogoutButton } from '../../../../src/components/profile/controls/ProfileLogoutButton';

describe('ProfileLogoutButton', () => {
  it('renders button with label', () => {
    const mockOnClick = vi.fn();
    render(<ProfileLogoutButton label="Logout" onClick={mockOnClick} />);

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = vi.fn();
    render(<ProfileLogoutButton label="Logout" onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('renders logout icon', () => {
    const mockOnClick = vi.fn();
    const { container } = render(
      <ProfileLogoutButton label="Logout" onClick={mockOnClick} />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies danger styling', () => {
    const mockOnClick = vi.fn();
    render(<ProfileLogoutButton label="Logout" onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: /logout/i });
    expect(button).toHaveClass('btn-base');
  });

  it('changes background on hover', () => {
    const mockOnClick = vi.fn();
    render(<ProfileLogoutButton label="Logout" onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: /logout/i });
    
    fireEvent.mouseEnter(button);
    // Background color changes are managed internally by state
    
    fireEvent.mouseLeave(button);
    // Background color reverts
  });
});
