import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InfoMessage } from '../../../../src/components/ui';

describe('InfoMessage', () => {
  it('renders info message', () => {
    render(<InfoMessage message="Information text" />);
    expect(screen.getByText('Information text')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <InfoMessage message="Info" className="info-custom" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('info-custom');
  });

  it('has info styling', () => {
    const { container } = render(<InfoMessage message="Info" />);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('bg-blue-50');
    expect(element).toHaveClass('text-blue-700');
  });
});
