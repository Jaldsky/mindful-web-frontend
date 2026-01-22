import React from 'react';
import { Globe } from 'lucide-react';
import { useTheme } from '../../../contexts';
import { useLocale, SUPPORTED_LOCALES } from '../../../contexts';
import { useTranslation } from "../../../hooks";
import { ControlButton } from './ControlButton';

export const HeaderControls: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { locale, setLocale } = useLocale();
  const { t } = useTranslation();

  const toggleLocale = () => {
    setLocale(locale === SUPPORTED_LOCALES.EN ? SUPPORTED_LOCALES.RU : SUPPORTED_LOCALES.EN);
  };

  return (
    <div className="flex items-center gap-2">
      <ControlButton
        onClick={toggleLocale}
        icon={<Globe size={14} />}
        label={locale === 'en' ? 'EN' : 'RU'}
        title={t('settings.language')}
      />
      <ControlButton
        onClick={toggleTheme}
        icon={<span>{isDark ? '☀️' : '🌙'}</span>}
        label={isDark ? 'LIGHT' : 'DARK'}
        title="Toggle theme"
      />
    </div>
  );
};
