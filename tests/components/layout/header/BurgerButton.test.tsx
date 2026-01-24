import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BurgerButton } from '../../../../src/components/layout/header/BurgerButton';

describe('BurgerButton', () => {
  it('renders a button with aria label', () => {
    const onClick = vi.fn();
    render(<BurgerButton onClick={onClick} />);

    const button = screen.getByRole('button', { name: /toggle menu/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<BurgerButton onClick={onClick} />);

    const button = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('reflects aria-expanded state', () => {
    const onClick = vi.fn();
    const { rerender } = render(<BurgerButton onClick={onClick} isOpen={false} />);

    const button = screen.getByRole('button', { name: /toggle menu/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');

    rerender(<BurgerButton onClick={onClick} isOpen />);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders the menu icon', () => {
    const onClick = vi.fn();
    const { container } = render(<BurgerButton onClick={onClick} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
