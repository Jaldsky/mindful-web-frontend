import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileField } from '../../../../src/components/profile/fields/ProfileField';

vi.mock('../../../../src/hooks', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('ProfileField', () => {
  it('renders label and value', () => {
    render(<ProfileField label="Username" value="alice" />);

    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('alice')).toBeInTheDocument();
  });

  it('calls onEdit when value is clicked', () => {
    const onEdit = vi.fn();
    render(<ProfileField label="Email" value="a@b.com" onEdit={onEdit} />);

    fireEvent.click(screen.getByText('a@b.com'));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onCopy when readOnly value is clicked', () => {
    const onCopy = vi.fn();
    render(<ProfileField label="User ID" value="id-123" readOnly onCopy={onCopy} />);

    fireEvent.click(screen.getByText('id-123'));
    expect(onCopy).toHaveBeenCalledTimes(1);
  });

  it('shows save/cancel actions in edit mode and triggers callbacks', () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();

    const { container } = render(
      <ProfileField label="Username" value="" isEditing onSave={onSave} onCancel={onCancel}>
        <input type="text" value="alice" onChange={() => undefined} />
      </ProfileField>
    );

    const wrapper = container.querySelector('.profile-field-container') as HTMLElement;
    fireEvent.mouseEnter(wrapper);

    const saveButton = screen.getByTitle('common.save');
    const cancelButton = screen.getByTitle('common.cancel');

    fireEvent.click(saveButton);
    fireEvent.click(cancelButton);

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('keeps save/cancel visible while editing', async () => {
    const { container } = render(
      <ProfileField label="Username" value="" isEditing onSave={() => undefined} onCancel={() => undefined}>
        <input type="text" value="alice" onChange={() => undefined} />
      </ProfileField>
    );

    const wrapper = container.querySelector('.profile-field-container') as HTMLElement;
    fireEvent.mouseEnter(wrapper);

    const saveButton = await screen.findByTitle('common.save');
    expect(saveButton).toHaveStyle({ opacity: '1' });

    fireEvent.mouseLeave(wrapper);
    expect(saveButton).toHaveStyle({ opacity: '1' });
  });
});
