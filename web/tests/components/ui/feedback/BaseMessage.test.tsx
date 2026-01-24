import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BaseMessage } from '../../../../src/components/ui';

describe('BaseMessage', () => {
  it('renders message with error variant', () => {
    render(<BaseMessage message="Error occurred" variant="error" />);
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });

  it('renders message with info variant', () => {
    render(<BaseMessage message="Information" variant="info" />);
    expect(screen.getByText('Information')).toBeInTheDocument();
  });

  it('renders message with success variant', () => {
    render(<BaseMessage message="Success!" variant="success" />);
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  it('renders message with warning variant', () => {
    render(<BaseMessage message="Warning!" variant="warning" />);
    expect(screen.getByText('Warning!')).toBeInTheDocument();
  });

  it('applies error variant styling', () => {
    const { container } = render(<BaseMessage message="Error" variant="error" />);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('bg-red-50');
    expect(element).toHaveClass('text-red-600');
  });

  it('applies info variant styling', () => {
    const { container } = render(<BaseMessage message="Info" variant="info" />);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('bg-blue-50');
    expect(element).toHaveClass('text-blue-700');
  });

  it('applies success variant styling', () => {
    const { container } = render(<BaseMessage message="Success" variant="success" />);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('bg-green-50');
    expect(element).toHaveClass('text-green-600');
  });

  it('applies warning variant styling', () => {
    const { container } = render(<BaseMessage message="Warning" variant="warning" />);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('bg-yellow-50');
    expect(element).toHaveClass('text-yellow-600');
  });

  it('applies custom className', () => {
    const { container } = render(
      <BaseMessage message="Test" variant="info" className="custom-class" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('custom-class');
  });

  it('applies base styling classes', () => {
    const { container } = render(<BaseMessage message="Test" variant="info" />);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('p-4');
    expect(element).toHaveClass('rounded-lg');
    expect(element).toHaveClass('border');
  });
});
