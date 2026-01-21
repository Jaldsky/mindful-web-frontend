import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../../../../src/components/ui';

describe('Input', () => {
  it('renders input element', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    
    expect(input).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Input label="Username" />);
    
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('associates label with input', () => {
    render(<Input label="Email" />);
    const label = screen.getByText('Email');
    const input = screen.getByRole('textbox');
    
    expect(label).toHaveAttribute('for', input.id);
  });

  it('renders with error message', () => {
    render(<Input error="This field is required" />);
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies error styling when error prop is provided', () => {
    const { container } = render(<Input error="Error message" />);
    const input = container.querySelector('input');
    
    expect(input).toHaveClass('border-red-500');
  });

  it('calls onChange when value changes', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('applies value prop', () => {
    render(<Input value="initial value" onChange={() => {}} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    
    expect(input.value).toBe('initial value');
  });

  it('applies fullWidth class', () => {
    const { container } = render(<Input fullWidth />);
    const wrapper = container.firstChild;
    
    expect(wrapper).toHaveClass('w-full');
  });

  it('disables input when disabled prop is true', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:opacity-50');
  });

  it('merges custom className', () => {
    const { container } = render(<Input className="custom-class" />);
    const input = container.querySelector('input');
    
    expect(input).toHaveClass('custom-class');
    expect(input).toHaveClass('rounded-lg');
  });

  it('uses custom id if provided', () => {
    render(<Input id="custom-id" label="Test" />);
    const input = screen.getByRole('textbox');
    
    expect(input).toHaveAttribute('id', 'custom-id');
  });

  it('generates id from label if not provided', () => {
    render(<Input label="My Label" />);
    const input = screen.getByRole('textbox');
    
    expect(input).toHaveAttribute('id', 'input-my-label');
  });

  it('accepts different input types', () => {
    render(<Input type="email" />);
    const input = screen.getByRole('textbox');
    
    expect(input).toHaveAttribute('type', 'email');
  });

  it('accepts placeholder', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    
    expect(input).toBeInTheDocument();
  });
});
