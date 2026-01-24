import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ModalHeader } from '../../../../src/components/modals/controls/ModalHeader';

describe('ModalHeader', () => {
  it('renders title and subtitle', () => {
    render(
      <ModalHeader
        title="Welcome"
        subtitle="Get started with Mindful Web"
      />
    );
    
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('Get started with Mindful Web')).toBeInTheDocument();
  });

  it('renders with animation by default', () => {
    const { container } = render(
      <ModalHeader
        title="Welcome"
        subtitle="Subtitle"
      />
    );
    
    const header = container.firstChild as HTMLElement;
    expect(header.style.animation).toContain('slideDown');
  });

  it('can disable animation', () => {
    const { container } = render(
      <ModalHeader
        title="Welcome"
        subtitle="Subtitle"
        shouldAnimate={false}
      />
    );
    
    const header = container.firstChild as HTMLElement;
    expect(header.style.animation).toBe('none');
  });
});
