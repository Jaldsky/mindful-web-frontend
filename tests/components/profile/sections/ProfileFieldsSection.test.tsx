import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileFieldsSection } from '../../../../src/components/profile/sections/ProfileFieldsSection';

vi.mock('../../../../src/hooks', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  timezoneDetector: {
    getSupportedTimezones: () => ['UTC'],
    formatTimezoneWithOffset: (tz: string) => `(${tz})`,
  },
}));

const createProps = () => ({
  userId: 'user-123',
  copiedUserId: false,
  onCopyUserId: vi.fn(),
  isAuthenticated: true,
  username: 'alice',
  email: 'alice@example.com',
  editingUsername: false,
  editingEmail: false,
  usernameInput: 'alice',
  emailInput: 'alice@example.com',
  usernameError: '',
  emailError: '',
  onUsernameInputChange: vi.fn(),
  onEmailInputChange: vi.fn(),
  onSaveUsername: vi.fn(),
  onCancelUsername: vi.fn(),
  onSaveEmail: vi.fn(),
  onCancelEmail: vi.fn(),
  onStartEditUsername: vi.fn(),
  onStartEditEmail: vi.fn(),
  timezone: 'UTC',
  onTimezoneChange: vi.fn(),
});

describe('ProfileFieldsSection', () => {
  it('renders user id and triggers copy', () => {
    const props = createProps();
    render(<ProfileFieldsSection {...props} />);

    fireEvent.click(screen.getByText('user-123'));
    expect(props.onCopyUserId).toHaveBeenCalledTimes(1);
  });

  it('renders username input when editing', () => {
    const props = createProps();
    render(
      <ProfileFieldsSection
        {...props}
        editingUsername
        usernameInput="edited"
      />
    );

    const input = screen.getByDisplayValue('edited');
    expect(input).toBeInTheDocument();
  });
});
