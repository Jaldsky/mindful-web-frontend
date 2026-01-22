import React, { useState, useRef, useEffect } from 'react';

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  length?: number;
}

export const CodeInput: React.FC<CodeInputProps> = ({
  value,
  onChange,
  error,
  disabled = false,
  length = 6,
}) => {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const newDigits = Array(length).fill('');
    for (let i = 0; i < length && i < value.length; i++) {
      newDigits[i] = value[i];
    }
    setDigits(newDigits);
  }, [value, length]);

  const handleChange = (index: number, newValue: string) => {
    if (newValue && !/^\d$/.test(newValue)) {
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = newValue;
    setDigits(newDigits);

    const code = newDigits.join('');
    onChange(code);

    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    
    if (pastedData.length > 0) {
      const newDigits = Array(length).fill('');
      for (let i = 0; i < pastedData.length && i < length; i++) {
        newDigits[i] = pastedData[i];
      }
      setDigits(newDigits);
      
      const code = newDigits.join('');
      onChange(code);

      const nextIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: '6px',
          justifyContent: 'flex-start',
          marginBottom: error ? 'var(--spacing-xs)' : 0,
        }}
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className="app-input border text-center"
            style={{
              width: '44px',
              height: '40px',
              color: 'var(--color-text-primary)',
              background: 'var(--color-bg-primary)',
              borderColor: error ? 'var(--color-error)' : 'var(--border-color)',
              borderWidth: '1px',
              padding: 0,
              borderRadius: 'var(--border-radius-md)',
              fontSize: 'var(--font-size-lg)',
              fontWeight: 600,
              transition: 'border-color var(--transition-normal), box-shadow var(--transition-normal)',
              boxShadow: error 
                ? '0 0 0 2px rgba(229, 115, 115, 0.1)' 
                : 'none',
            }}
            onFocus={(e) => {
              e.target.select();
              if (!error) {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(76, 175, 80, 0.1)';
              }
            }}
            onBlur={(e) => {
              if (!error) {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          />
        ))}
      </div>
      {error && (
        <div
          className="text-sm"
          style={{
            color: 'var(--color-error)',
            fontSize: 'var(--font-size-xs)',
            marginTop: 'var(--spacing-xs)',
            textAlign: 'center',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};
