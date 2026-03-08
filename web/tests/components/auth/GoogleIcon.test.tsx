import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { GoogleIcon } from '../../../src/components/auth/GoogleIcon';

describe('GoogleIcon', () => {
  it('renders an SVG element', () => {
    const { container } = render(<GoogleIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has aria-hidden for accessibility', () => {
    const { container } = render(<GoogleIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('uses default size 24', () => {
    const { container } = render(<GoogleIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('applies custom size', () => {
    const { container } = render(<GoogleIcon size={40} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '40');
    expect(svg).toHaveAttribute('height', '40');
  });

  it('applies custom className', () => {
    const { container } = render(<GoogleIcon className="my-icon" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('my-icon');
  });

  it('has correct viewBox', () => {
    const { container } = render(<GoogleIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('renders four path elements (Google G logo)', () => {
    const { container } = render(<GoogleIcon />);
    const paths = container.querySelectorAll('svg path');
    expect(paths).toHaveLength(4);
  });

  it('uses Google brand colors for paths', () => {
    const { container } = render(<GoogleIcon />);
    const paths = container.querySelectorAll('svg path');
    const fills = Array.from(paths).map((p) => p.getAttribute('fill'));
    expect(fills).toContain('#4285F4');
    expect(fills).toContain('#34A853');
    expect(fills).toContain('#FBBC05');
    expect(fills).toContain('#EA4335');
  });
});
