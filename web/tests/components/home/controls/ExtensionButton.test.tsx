import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Chrome } from 'lucide-react';
import { ExtensionButton } from '../../../../src/components/home/controls/ExtensionButton';

describe('ExtensionButton', () => {
  it('renders browser name', () => {
    render(
      <ExtensionButton
        browser="Chrome"
        icon={<Chrome size={20} />}
        available
      />
    );

    expect(screen.getByText('Chrome')).toBeInTheDocument();
  });

  it('renders icon', () => {
    const { container } = render(
      <ExtensionButton
        browser="Chrome"
        icon={<Chrome size={20} />}
        available
      />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders as link when available and href provided', () => {
    render(
      <ExtensionButton
        browser="Chrome"
        icon={<Chrome size={20} />}
        available
        href="https://example.com"
      />
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders as button when not available', () => {
    render(
      <ExtensionButton
        browser="Firefox"
        icon={<Chrome size={20} />}
        available={false}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('applies reduced opacity when not available', () => {
    const { container } = render(
      <ExtensionButton
        browser="Firefox"
        icon={<Chrome size={20} />}
        available={false}
      />
    );

    const button = container.querySelector('button');
    expect(button).toHaveStyle({ opacity: '0.5' });
  });

  it('applies full opacity when available', () => {
    const { container } = render(
      <ExtensionButton
        browser="Chrome"
        icon={<Chrome size={20} />}
        available
      />
    );

    const button = container.querySelector('button');
    expect(button).toHaveStyle({ opacity: '1' });
  });

  it('changes border color on hover when available', () => {
    const { container } = render(
      <ExtensionButton
        browser="Chrome"
        icon={<Chrome size={20} />}
        available
      />
    );

    const button = container.querySelector('button') as HTMLElement;
    fireEvent.mouseEnter(button);
    expect(button.style.borderColor).toBe('var(--color-primary)');
  });

  it('resets border color on mouse leave when available', () => {
    const { container } = render(
      <ExtensionButton
        browser="Chrome"
        icon={<Chrome size={20} />}
        available
      />
    );

    const button = container.querySelector('button') as HTMLElement;
    fireEvent.mouseEnter(button);
    fireEvent.mouseLeave(button);
    expect(button.style.borderColor).toBe('var(--border-color)');
  });

  it('does not change border on hover when not available', () => {
    const { container } = render(
      <ExtensionButton
        browser="Firefox"
        icon={<Chrome size={20} />}
        available={false}
      />
    );

    const button = container.querySelector('button') as HTMLElement;
    const originalBorder = button.style.borderColor;
    fireEvent.mouseEnter(button);
    expect(button.style.borderColor).toBe(originalBorder);
  });
});
