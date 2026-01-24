import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalToggleButton } from '../../../../src/components/modals/controls/ModalToggleButton';

describe('ModalToggleButton', () => {
  it('renders with icon', () => {
    render(
      <ModalToggleButton
        icon="🌙"
        onClick={vi.fn()}
        title="Toggle theme"
      />
    );
    expect(screen.getByTitle('Toggle theme')).toBeInTheDocument();
    expect(screen.getByText('🌙')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(
      <ModalToggleButton
        icon="☀️"
        onClick={handleClick}
        title="Toggle theme"
      />
    );
    
    const button = screen.getByTitle('Toggle theme');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('has correct title attribute', () => {
    render(
      <ModalToggleButton
        icon="🇺🇸"
        onClick={vi.fn()}
        title="Switch language"
      />
    );
    
    const button = screen.getByTitle('Switch language');
    expect(button).toBeInTheDocument();
  });

  it('changes style on hover', () => {
    render(
      <ModalToggleButton
        icon="🌙"
        onClick={vi.fn()}
        title="Toggle theme"
      />
    );
    
    const button = screen.getByTitle('Toggle theme');
    const initialOpacity = button.style.opacity;
    
    fireEvent.mouseEnter(button);
    const hoveredOpacity = button.style.opacity;
    
    expect(hoveredOpacity).not.toBe(initialOpacity);
  });
});
