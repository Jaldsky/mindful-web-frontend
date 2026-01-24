import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateInput } from '../../../../src/components/analytics/date-range/DateInput';

describe('DateInput', () => {
  it('renders label', () => {
    render(<DateInput label="Start Date" value="" onChange={() => {}} />);
    
    expect(screen.getByText('Start Date:')).toBeInTheDocument();
  });

  it('renders date input with value', () => {
    render(<DateInput label="Date" value="2024-01-15" onChange={() => {}} />);
    const input = screen.getByDisplayValue('2024-01-15') as HTMLInputElement;
    
    expect(input).toBeInTheDocument();
    expect(input.type).toBe('date');
  });

  it('calls onChange when date changes', () => {
    const handleChange = vi.fn();
    render(<DateInput label="Date" value="2024-01-01" onChange={handleChange} />);
    
    const input = screen.getByDisplayValue('2024-01-01');
    fireEvent.change(input, { target: { value: '2024-01-31' } });
    
    expect(handleChange).toHaveBeenCalledWith('2024-01-31');
  });

  it('associates label with input', () => {
    render(<DateInput label="Test Date" value="" onChange={() => {}} />);
    
    const label = screen.getByText('Test Date:');
    const input = screen.getByLabelText('Test Date:');
    
    expect(label).toHaveAttribute('for', input.id);
  });

  it('applies min constraint', () => {
    render(
      <DateInput
        label="Date"
        value="2024-01-15"
        onChange={() => {}}
        min="2024-01-01"
      />
    );
    const input = screen.getByDisplayValue('2024-01-15');
    
    expect(input).toHaveAttribute('min', '2024-01-01');
  });

  it('applies max constraint', () => {
    render(
      <DateInput
        label="Date"
        value="2024-01-15"
        onChange={() => {}}
        max="2024-12-31"
      />
    );
    const input = screen.getByDisplayValue('2024-01-15');
    
    expect(input).toHaveAttribute('max', '2024-12-31');
  });

  it('generates consistent id from label', () => {
    const { rerender } = render(
      <DateInput label="My Date" value="" onChange={() => {}} />
    );
    const firstInput = screen.getByLabelText('My Date:');
    const firstId = firstInput.id;
    
    // Rerender and check id is the same
    rerender(<DateInput label="My Date" value="2024-01-01" onChange={() => {}} />);
    const secondInput = screen.getByLabelText('My Date:');
    
    expect(secondInput.id).toBe(firstId);
  });

  it('handles labels with spaces correctly', () => {
    render(<DateInput label="Start Date" value="" onChange={() => {}} />);
    const input = screen.getByLabelText('Start Date:');
    
    expect(input.id).toMatch(/date-input-start-date/);
  });
});
