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
    
    const startInput = screen.getByLabelText('From:') as HTMLInputElement;
    const endInput = screen.getByLabelText('To:') as HTMLInputElement;
    
    expect(startInput.value).toBe('2024-01-01');
    expect(endInput.value).toBe('2024-01-31');
  });

  it('calls onStartDateChange when start date changes', () => {
    render(<DateRangeSelector {...mockProps} />);
    
    const startInput = screen.getByLabelText('From:');
    fireEvent.change(startInput, { target: { value: '2024-02-01' } });
    
    expect(mockProps.onStartDateChange).toHaveBeenCalledWith('2024-02-01');
  });

  it('calls onEndDateChange when end date changes', () => {
    render(<DateRangeSelector {...mockProps} />);
    
    const endInput = screen.getByLabelText('To:');
    fireEvent.change(endInput, { target: { value: '2024-02-28' } });
    
    expect(mockProps.onEndDateChange).toHaveBeenCalledWith('2024-02-28');
  });

  it('renders quick select buttons', () => {
    render(<DateRangeSelector {...mockProps} />);
    
    expect(screen.getByText('7 days')).toBeInTheDocument();
    expect(screen.getByText('30 days')).toBeInTheDocument();
    expect(screen.getByText('90 days')).toBeInTheDocument();
  });

  it('calls onQuickSelect when quick button is clicked', () => {
    render(<DateRangeSelector {...mockProps} />);
    
    fireEvent.click(screen.getByText('7 days'));
    expect(mockProps.onQuickSelect).toHaveBeenCalledWith(7);
    
    fireEvent.click(screen.getByText('30 days'));
    expect(mockProps.onQuickSelect).toHaveBeenCalledWith(30);
    
    fireEvent.click(screen.getByText('90 days'));
    expect(mockProps.onQuickSelect).toHaveBeenCalledWith(90);
  });
});
