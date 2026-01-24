import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ControlButton } from '../../../../src/components/layout/header/ControlButton';

describe('ControlButton', () => {
  it('renders with icon and label', () => {
    render(
      <ControlButton
        onClick={() => {}}
        icon={<span data-testid="test-icon">🌙</span>}
        label="DARK"
        title="Toggle theme"
      />
    );
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('DARK')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(
      <ControlButton
        onClick={handleClick}
        icon={<span>🌙</span>}
        label="DARK"
        title="Toggle theme"
      />
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('has correct title attribute', () => {
    render(
      <ControlButton
        onClick={() => {}}
        icon={<span>🌙</span>}
        label="DARK"
        title="Toggle theme"
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Toggle theme');
  });

  it('renders label in uppercase style', () => {
    render(
      <ControlButton
        onClick={() => {}}
        icon={<span>🌙</span>}
        label="test"
        title="Test button"
      />
    );
    
    const label = screen.getByText('test');
    expect(label).toHaveStyle({ textTransform: 'uppercase' });
  });

  it('hides label in compact variant', () => {
    render(
      <ControlButton
        onClick={() => {}}
        icon={<span>🌙</span>}
        label="DARK"
        title="Toggle theme"
        variant="compact"
      />
    );
    
    expect(screen.queryByText('DARK')).not.toBeInTheDocument();
  });
});
