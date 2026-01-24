import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimezoneField } from '../../../../src/components/profile/fields/TimezoneField';

vi.mock('../../../../src/hooks', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  timezoneDetector: {
    getSupportedTimezones: () => ['UTC', 'Europe/Berlin'],
    formatTimezoneWithOffset: (tz: string) => `(${tz})`,
  },
}));

describe('TimezoneField', () => {
  it('renders label and timezone options', () => {
    render(<TimezoneField timezone="UTC" onChange={() => undefined} />);

    expect(screen.getByText('profile.timezone')).toBeInTheDocument();
    expect(screen.getByText('(UTC)')).toBeInTheDocument();
    expect(screen.getByText('(Europe/Berlin)')).toBeInTheDocument();
  });

  it('calls onChange when timezone changes', () => {
    const onChange = vi.fn();
    render(<TimezoneField timezone="UTC" onChange={onChange} />);

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Europe/Berlin' } });
    expect(onChange).toHaveBeenCalledWith('Europe/Berlin');
  });
});
