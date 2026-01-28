import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateRangeSelector } from '../../../../src/components/analytics/date-range/DateRangeSelector';

describe('DateRangeSelector', () => {
  const mockProps = {
    dateRange: {
      start: '2024-01-01',
      end: '2024-01-31',
    },
    onStartDateChange: vi.fn(),
    onEndDateChange: vi.fn(),
    onQuickSelect: vi.fn(),
  };

  it('renders date inputs with values', () => {
    render(<DateRangeSelector {...mockProps} />);

    // Open dropdown first
    fireEvent.click(screen.getByRole('button', { name: /—/ }));

    const startLabel = screen.getByText('Start Date');
    const endLabel = screen.getByText('End Date');
    const startInput = startLabel.parentElement?.querySelector('input') as HTMLInputElement;
    const endInput = endLabel.parentElement?.querySelector('input') as HTMLInputElement;
    
    expect(startInput.value).toBe('2024-01-01');
    expect(endInput.value).toBe('2024-01-31');
  });

  it('calls onStartDateChange when start date changes', () => {
    render(<DateRangeSelector {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: /—/ }));
    const startLabel = screen.getByText('Start Date');
    const startInput = startLabel.parentElement?.querySelector('input') as HTMLInputElement;
    fireEvent.change(startInput, { target: { value: '2024-02-01' } });
    
    expect(mockProps.onStartDateChange).toHaveBeenCalledWith('2024-02-01');
  });

  it('calls onEndDateChange when end date changes', () => {
    render(<DateRangeSelector {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: /—/ }));
    const endLabel = screen.getByText('End Date');
    const endInput = endLabel.parentElement?.querySelector('input') as HTMLInputElement;
    fireEvent.change(endInput, { target: { value: '2024-02-28' } });
    
    expect(mockProps.onEndDateChange).toHaveBeenCalledWith('2024-02-28');
  });

  it('renders quick select buttons', () => {
    render(<DateRangeSelector {...mockProps} />);

    // Quick ranges exist in DOM (desktop) and also inside dropdown (mobile)
    expect(screen.getAllByText(/7 days/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/30 days/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/90 days/).length).toBeGreaterThan(0);
  });

  it('calls onQuickSelect when quick button is clicked', () => {
    render(<DateRangeSelector {...mockProps} />);
    
    fireEvent.click(screen.getAllByText(/7 days/)[0]);
    expect(mockProps.onQuickSelect).toHaveBeenCalledWith(7);
    
    fireEvent.click(screen.getAllByText(/30 days/)[0]);
    expect(mockProps.onQuickSelect).toHaveBeenCalledWith(30);
    
    fireEvent.click(screen.getAllByText(/90 days/)[0]);
    expect(mockProps.onQuickSelect).toHaveBeenCalledWith(90);
  });
});
