import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormField } from '../../../src/components/auth/FormField';

describe('FormField', () => {
  it('renders label and input', () => {
    render(
      <FormField
        id="test-field"
        label="Test Label"
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows required asterisk when required', () => {
    render(
      <FormField
        id="test-field"
        label="Test Label"
        value=""
        onChange={() => {}}
        required
      />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message', () => {
    const errorMessage = 'This field is required';
    render(
      <FormField
        id="test-field"
        label="Test Label"
        value=""
        onChange={() => {}}
        error={errorMessage}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    const handleChange = vi.fn();
    render(
      <FormField
        id="test-field"
        label="Test Label"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(handleChange).toHaveBeenCalledWith('new value');
  });

  it('disables input when disabled prop is true', () => {
    render(
      <FormField
        id="test-field"
        label="Test Label"
        value=""
        onChange={() => {}}
        disabled
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('applies placeholder text', () => {
    render(
      <FormField
        id="test-field"
        label="Test Label"
        value=""
        onChange={() => {}}
        placeholder="Enter text"
      />
    );

    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders password input when type is password', () => {
    render(
      <FormField
        id="test-field"
        label="Test Label"
        type="password"
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('applies maxLength attribute', () => {
    render(
      <FormField
        id="test-field"
        label="Test Label"
        value=""
        onChange={() => {}}
        maxLength={10}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('maxLength', '10');
  });

  it('applies autoComplete attribute', () => {
    render(
      <FormField
        id="test-field"
        label="Test Label"
        value=""
        onChange={() => {}}
        autoComplete="username"
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('autoComplete', 'username');
  });
});
