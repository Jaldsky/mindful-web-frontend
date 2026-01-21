import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTranslation } from '../../../src/hooks/i18n/useTranslation';
import { LocaleProvider } from '../../../src/contexts';

describe('useTranslation', () => {
  it('returns translation function', () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: LocaleProvider,
    });
    
    expect(result.current.t).toBeDefined();
    expect(typeof result.current.t).toBe('function');
  });

  it('translates common keys', () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: LocaleProvider,
    });
    
    const appName = result.current.t('common.appName');
    expect(appName).toBeTruthy();
    expect(typeof appName).toBe('string');
  });

  it('returns key if translation not found', () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: LocaleProvider,
    });
    
    const missing = result.current.t('missing.key.that.does.not.exist');
    expect(missing).toBe('missing.key.that.does.not.exist');
  });
});
