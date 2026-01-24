import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from '../../../hooks';
import { timezoneDetector } from '../../../hooks';

interface TimezoneFieldProps {
  timezone: string;
  onChange: (timezone: string) => void;
}

export const TimezoneField: React.FC<TimezoneFieldProps> = ({ timezone, onChange }) => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        marginBottom: 'var(--spacing-sm)',
      }}
    >
      <label
        style={{
          display: 'block',
          marginBottom: 'var(--spacing-sm)',
          fontWeight: 500,
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--font-size-sm)',
        }}
      >
        {t('profile.timezone')}
      </label>
      <div
        className="profile-field-container"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
        onMouseEnter={(e) => {
          const select = e.currentTarget.querySelector('select') as HTMLElement;
          const icon = e.currentTarget.querySelector('.timezone-action-icon') as HTMLElement;
          if (select && document.activeElement !== select) {
            select.style.borderColor = 'var(--color-primary)';
          }
          if (icon) {
            icon.style.opacity = '1';
            icon.style.transform = 'translateX(0)';
          }
        }}
        onMouseLeave={(e) => {
          const select = e.currentTarget.querySelector('select') as HTMLElement;
          const icon = e.currentTarget.querySelector('.timezone-action-icon') as HTMLElement;
          if (select && document.activeElement !== select) {
            select.style.borderColor = 'var(--border-color)';
          }
          if (icon) {
            icon.style.opacity = '0';
            icon.style.transform = 'translateX(8px)';
          }
        }}
      >
        <select
          value={timezone}
          onChange={(e) => {
            onChange(e.target.value);
            setTimeout(() => {
              e.target.blur();
            }, 100);
          }}
          style={{
            flex: 1,
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-primary)',
            fontWeight: 500,
            padding: '12px',
            paddingRight: '40px',
            borderRadius: 'var(--border-radius-md)',
            backgroundColor: 'var(--color-bg-primary)',
            border: '2px solid var(--border-color)',
            fontFamily: 'var(--font-family)',
            transition: 'border-color var(--transition-normal), background-color var(--transition-normal), box-shadow var(--transition-normal)',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            outline: 'none',
            boxShadow: 'none',
            appearance: 'none',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-primary)';
            e.target.style.boxShadow = 'none';
            e.target.style.outline = 'none';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border-color)';
            e.target.style.boxShadow = 'none';
            e.target.style.outline = 'none';
          }}
        >
          {timezoneDetector.getSupportedTimezones().map((tz) => (
            <option key={tz} value={tz}>
              {timezoneDetector.formatTimezoneWithOffset(tz)}
            </option>
          ))}
        </select>
        <div
          className="timezone-action-icon"
          style={{
            position: 'absolute',
            right: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '22px',
            height: '22px',
            color: 'var(--color-primary)',
            opacity: 0,
            transform: 'translateX(8px)',
            transition: 'opacity var(--transition-normal), transform var(--transition-normal)',
            pointerEvents: 'none',
          }}
        >
          <ChevronDown size={22} />
        </div>
      </div>
    </div>
  );
};
