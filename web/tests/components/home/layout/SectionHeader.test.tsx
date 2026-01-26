import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sparkles } from 'lucide-react';
import { SectionHeader } from '../../../../src/components/home/layout/SectionHeader';

describe('SectionHeader', () => {
  const defaultProps = {
    icon: <Sparkles size={16} />,
    title: 'Section Title',
    color: '#9C27B0',
  };

  it('renders title', () => {
    render(<SectionHeader {...defaultProps} />);

    expect(screen.getByText('Section Title')).toBeInTheDocument();
  });

  it('renders icon', () => {
    const { container } = render(<SectionHeader {...defaultProps} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies color to icon container background', () => {
    const { container } = render(<SectionHeader {...defaultProps} />);

    // Find the icon container (32x32 size)
    const divs = container.querySelectorAll('div');
    const iconContainer = Array.from(divs).find(
      (div) => div.style.width === '32px'
    ) as HTMLElement;

    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer.style.backgroundColor).toBe('rgb(156, 39, 176)');
  });

  it('renders decorative gradient line', () => {
    const { container } = render(<SectionHeader {...defaultProps} />);

    // Find the gradient line (height 2px)
    const divs = container.querySelectorAll('div');
    const gradientLine = Array.from(divs).find(
      (div) => div.style.height === '2px'
    );

    expect(gradientLine).toBeInTheDocument();
  });

  it('applies correct gradient color to decorative line', () => {
    const { container } = render(<SectionHeader {...defaultProps} />);

    // Find the gradient line (height 2px)
    const divs = container.querySelectorAll('div');
    const gradientLine = Array.from(divs).find(
      (div) => div.style.height === '2px'
    ) as HTMLElement;

    expect(gradientLine.style.background).toContain('rgb(156, 39, 176)');
  });

  it('has flex layout', () => {
    const { container } = render(<SectionHeader {...defaultProps} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ display: 'flex' });
    expect(wrapper).toHaveStyle({ alignItems: 'center' });
  });

  it('title has correct styles', () => {
    render(<SectionHeader {...defaultProps} />);

    const title = screen.getByText('Section Title');
    expect(title.tagName).toBe('H2');
    expect(title).toHaveStyle({ fontWeight: '600' });
  });
});
