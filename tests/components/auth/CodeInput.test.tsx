import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CodeInput } from '../../../src/components/auth/CodeInput';

describe('CodeInput', () => {
  it('renders correct number of inputs', () => {
    const handleChange = vi.fn();
    render(<CodeInput length={6} value="" onChange={handleChange} />);
    
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);
  });

  it('calls onChange when value changes', () => {
    const handleChange = vi.fn();
    render(<CodeInput length={6} value="" onChange={handleChange} />);
    
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '1' } });
    
    expect(handleChange).toHaveBeenCalledWith('1');
  });

  it('rejects non-digit characters', () => {
    const handleChange = vi.fn();
    render(<CodeInput length={6} value="" onChange={handleChange} />);
    
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'a' } });
    
    // Should not call onChange for non-digit
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('moves to next input when digit entered', () => {
    const handleChange = vi.fn();
    render(<CodeInput length={6} value="" onChange={handleChange} />);
    
    const inputs = screen.getAllByRole('textbox');
    inputs[0].focus();
    fireEvent.change(inputs[0], { target: { value: '1' } });
    
    // Next input should be focused
    expect(document.activeElement).toBe(inputs[1]);
  });

  it('moves to previous input on Backspace when current is empty', () => {
    const handleChange = vi.fn();
    render(<CodeInput length={6} value="1" onChange={handleChange} />);
    
    const inputs = screen.getAllByRole('textbox');
    inputs[1].focus();
    fireEvent.keyDown(inputs[1], { key: 'Backspace' });
    
    // Previous input should be focused
    expect(document.activeElement).toBe(inputs[0]);
  });

  it('handles paste event with digits', () => {
    const handleChange = vi.fn();
    render(<CodeInput length={6} value="" onChange={handleChange} />);
    
    const inputs = screen.getAllByRole('textbox');
    const clipboardData = {
      getData: vi.fn().mockReturnValue('123456'),
    };
    
    fireEvent.paste(inputs[0], {
      clipboardData,
    });
    
    expect(handleChange).toHaveBeenCalledWith('123456');
  });

  it('handles paste event with non-digits', () => {
    const handleChange = vi.fn();
    render(<CodeInput length={6} value="" onChange={handleChange} />);
    
    const inputs = screen.getAllByRole('textbox');
    const clipboardData = {
      getData: vi.fn().mockReturnValue('abc123def'),
    };
    
    fireEvent.paste(inputs[0], {
      clipboardData,
    });
    
    // Should extract only digits
    expect(handleChange).toHaveBeenCalledWith('123');
  });

  it('limits pasted data to input length', () => {
    const handleChange = vi.fn();
    render(<CodeInput length={6} value="" onChange={handleChange} />);
    
    const inputs = screen.getAllByRole('textbox');
    const clipboardData = {
      getData: vi.fn().mockReturnValue('1234567890'),
    };
    
    fireEvent.paste(inputs[0], {
      clipboardData,
    });
    
    // Should only take first 6 digits
    expect(handleChange).toHaveBeenCalledWith('123456');
  });

  it('focuses correct input after paste', () => {
    const handleChange = vi.fn();
    render(<CodeInput length={6} value="" onChange={handleChange} />);
    
    const inputs = screen.getAllByRole('textbox');
    const clipboardData = {
      getData: vi.fn().mockReturnValue('123'),
    };
    
    inputs[0].focus();
    fireEvent.paste(inputs[0], {
      clipboardData,
    });
    
    // Should focus the next empty input or last one
    // After paste of 3 digits, should focus index 3 (4th input)
    expect(document.activeElement).toBe(inputs[3]);
  });

  it('displays initial value correctly', () => {
    const handleChange = vi.fn();
    render(<CodeInput length={6} value="123" onChange={handleChange} />);
    
    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveValue('1');
    expect(inputs[1]).toHaveValue('2');
    expect(inputs[2]).toHaveValue('3');
    expect(inputs[3]).toHaveValue('');
  });
});
