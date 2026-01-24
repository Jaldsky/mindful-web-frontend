/**
 * Translation hook
 * Provides translation function for current locale
 */

import { useMemo } from 'react';
import { useLocale } from '../../contexts';
import { translationService } from '../utils';
import type { UseTranslationReturn } from '../types';

export function useTranslation(): UseTranslationReturn {
  const { locale } = useLocale();

  const t = useMemo(() => {
    return (key: string, params?: Record<string, string | number>): string => {
      return translationService.translate(locale, key, params);
    };
  }, [locale]);

  return { t, locale };
}
