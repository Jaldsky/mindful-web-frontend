import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorMessage } from '../../../../src/components/ui';

describe('ErrorMessage', () => {
  it('renders error message', () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ErrorMessage message="Error" className="my-error" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('my-error');
  });

  it('has error styling', () => {
    const { container } = render(<ErrorMessage message="Error" />);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('bg-red-50');
    expect(element).toHaveClass('text-red-600');
  });
});
