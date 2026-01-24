import React, { useEffect, useState } from 'react';
import { Edit2, Copy, Check, X } from 'lucide-react';
import { useTranslation } from '../../../hooks';

interface ProfileFieldProps {
  label: string;
  value: string;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onCopy?: () => void;
  copied?: boolean;
  children?: React.ReactNode;
  readOnly?: boolean;
  editIcon?: React.ReactNode;
}

export const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  value,
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
  onCopy,
  copied = false,
  children,
  readOnly = false,
  editIcon,
}) => {
  const { t } = useTranslation();
  const [buttonsVisible, setButtonsVisible] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setButtonsVisible(true);
    }
  }, [isEditing]);

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
        {label}
      </label>

      {isEditing ? (
        <div
          className="profile-field-container"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-start',
          }}
          onMouseEnter={(e) => {
            setButtonsVisible(true);
            const input = e.currentTarget.querySelector('input, select') as HTMLElement;
            if (input) {
              input.style.borderColor = 'var(--color-primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isEditing) {
              setButtonsVisible(false);
            }
            const input = e.currentTarget.querySelector('input, select') as HTMLElement;
            if (input && document.activeElement !== input) {
              input.style.borderColor = 'var(--border-color)';
            }
          }}
        >
          <div style={{ flex: 1, position: 'relative' }}>
            {children}
            {onSave && onCancel && (
              <>
                <div
                  onClick={onSave}
                  title={t('common.save')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '12px',
                    transform: buttonsVisible ? 'translateX(0)' : 'translateX(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                    opacity: buttonsVisible ? 1 : 0,
                    transition: 'opacity var(--transition-normal), transform var(--transition-normal)',
                  }}
                >
                  <Check size={22} />
                </div>
                <div
                  onClick={onCancel}
                  title={t('common.cancel')}
                  style={{
                    position: 'absolute',
                    right: '40px',
                    top: '12px',
                    transform: buttonsVisible ? 'translateX(0)' : 'translateX(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '22px',
                    height: '22px',
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                    opacity: buttonsVisible ? 1 : 0,
                    transition: 'opacity var(--transition-normal), transform var(--transition-normal)',
                  }}
                >
                  <X size={22} />
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div
          className="profile-field-container"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
          onMouseEnter={(e) => {
            if ((!readOnly && onEdit) || (readOnly && onCopy)) {
              const field = e.currentTarget.querySelector('.profile-field-value') as HTMLElement;
              const icon = e.currentTarget.querySelector('.profile-action-icon') as HTMLElement;
              if (field) {
                field.style.borderColor = 'var(--color-primary)';
              }
              if (icon) {
                icon.style.opacity = '1';
                icon.style.transform = 'translateX(0)';
              }
            }
          }}
          onMouseLeave={(e) => {
            if ((!readOnly && onEdit) || (readOnly && onCopy)) {
              const field = e.currentTarget.querySelector('.profile-field-value') as HTMLElement;
              const icon = e.currentTarget.querySelector('.profile-action-icon') as HTMLElement;
              if (field) {
                field.style.borderColor = 'var(--border-color)';
                field.style.boxShadow = 'none';
              }
              if (icon) {
                icon.style.opacity = '0';
                icon.style.transform = 'translateX(8px)';
              }
            }
          }}
        >
          <div
            className="profile-field-value"
            style={{
              flex: 1,
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-primary)',
              fontWeight: 500,
              wordBreak: 'break-word',
              lineHeight: 1.5,
              padding: '12px',
              paddingRight: ((!readOnly && onEdit) || (readOnly && onCopy)) ? '40px' : '12px',
              borderRadius: 'var(--border-radius-md)',
              backgroundColor: 'var(--color-bg-primary)',
              border: '2px solid var(--border-color)',
              fontFamily: 'var(--font-family)',
              transition: 'border-color var(--transition-normal), background-color var(--transition-normal), box-shadow var(--transition-normal), padding-right var(--transition-normal)',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              cursor: (readOnly && onCopy) || (!readOnly && onEdit) ? 'pointer' : 'default',
            }}
            onClick={(!readOnly && onEdit) ? onEdit : (readOnly && onCopy) ? onCopy : undefined}
          >
            {value || '—'}
          </div>
          {!readOnly && onEdit && (
            <div
              className="profile-action-icon"
              style={{
                position: 'absolute',
                right: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                color: 'var(--color-primary)',
                opacity: 0,
                transform: 'translateX(8px)',
                transition: 'opacity var(--transition-normal), transform var(--transition-normal)',
                pointerEvents: 'none',
              }}
            >
              {editIcon || <Edit2 size={22} />}
            </div>
          )}
          {readOnly && onCopy && (
            <div
              className="profile-action-icon"
              style={{
                position: 'absolute',
                right: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                color: copied ? 'var(--color-primary)' : 'var(--color-primary)',
                opacity: 0,
                transform: 'translateX(8px)',
                transition: 'opacity var(--transition-normal), transform var(--transition-normal)',
                pointerEvents: 'none',
              }}
            >
              {copied ? <Check size={22} /> : <Copy size={22} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
