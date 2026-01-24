import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuickRangeButton } from '../../../../src/components/analytics/date-range/QuickRangeButton';

describe('QuickRangeButton', () => {
  it('renders with label', () => {
    render(<QuickRangeButton label="7 days" onClick={() => {}} />);
    
    expect(screen.getByText('7 days')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<QuickRangeButton label="30 days" onClick={handleClick} />);
    
    const button = screen.getByText('30 days');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders as a button element', () => {
    render(<QuickRangeButton label="Test" onClick={() => {}} />);
    const button = screen.getByRole('button', { name: 'Test' });
    
    expect(button).toBeInTheDocument();
  });

  it('applies outline variant styling', () => {
    const { container } = render(
      <QuickRangeButton label="Test" onClick={() => {}} />
    );
    const button = container.querySelector('button');
    
    expect(button).toHaveClass('border');
  });

  it('applies small size styling', () => {
    const { container } = render(
      <QuickRangeButton label="Test" onClick={() => {}} />
    );
    const button = container.querySelector('button');
    
    expect(button).toHaveClass('text-xs');
  });

  it('can be clicked multiple times', () => {
    const handleClick = vi.fn();
    render(<QuickRangeButton label="90 days" onClick={handleClick} />);
    
    const button = screen.getByText('90 days');
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(3);
  });
});
