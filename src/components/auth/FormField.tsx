import React, { useState } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  maxLength?: number;
  pattern?: string;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  disabled = false,
  autoComplete,
  maxLength,
  pattern,
  required = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="auth-form-group" style={{ marginBottom: 'var(--spacing-lg)' }}>
      <label
        htmlFor={id}
        className="block font-medium"
        style={{
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--spacing-sm)',
          fontSize: 'var(--font-size-sm)'
        }}
      >
        {label}
        {required && <span style={{ color: 'var(--color-error)' }}> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        pattern={pattern}
        className="app-input w-full border"
        style={{
          color: 'var(--color-text-primary)',
          background: 'var(--color-bg-primary)',
          borderColor: error ? 'var(--color-error)' : isFocused ? 'var(--color-primary)' : 'var(--border-color)',
          padding: '10px 12px',
          borderRadius: 'var(--border-radius-md)',
          transition: 'border-color var(--transition-normal), box-shadow var(--transition-normal)',
          boxShadow: isFocused ? '0 0 0 2px rgba(76, 175, 80, 0.1)' : 'none'
        }}
      />
      {error && (
        <div
          className="text-sm"
          style={{
            color: 'var(--color-error)',
            marginTop: 'var(--spacing-xs)'
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};
