import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileErrorBanner } from '../../../../src/components/profile/feedback/ProfileErrorBanner';

describe('ProfileErrorBanner', () => {
  it('renders message when provided', () => {
    render(<ProfileErrorBanner message="Network error" isVisible onClose={() => undefined} />);

    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('does not render when message is null', () => {
    const { container } = render(
      <ProfileErrorBanner message={null} isVisible onClose={() => undefined} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(<ProfileErrorBanner message="Network error" isVisible onClose={onClose} />);

    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
