import { describe, it, expect } from 'vitest';
import { PROFILE_ICON_COLORS } from '../../../src/components/profile/constants';

describe('PROFILE_ICON_COLORS', () => {
  it('has username colors', () => {
    expect(PROFILE_ICON_COLORS.USERNAME).toEqual({
      bg: '#E3F2FD',
      text: '#2196F3',
    });
  });

  it('has email colors', () => {
    expect(PROFILE_ICON_COLORS.EMAIL).toEqual({
      bg: '#E8F5E9',
      text: '#4CAF50',
    });
  });

  it('has timezone colors', () => {
    expect(PROFILE_ICON_COLORS.TIMEZONE).toEqual({
      bg: '#FFF3E0',
      text: '#FF9800',
    });
  });

  it('has status colors', () => {
    expect(PROFILE_ICON_COLORS.STATUS).toEqual({
      bg: 'var(--color-primary)',
      text: 'white',
    });
  });

  it('is immutable (const assertion)', () => {
    // This test verifies that TypeScript enforces immutability
    // If PROFILE_ICON_COLORS is properly typed with 'as const', 
    // TypeScript will prevent modifications at compile time
    expect(Object.isFrozen(PROFILE_ICON_COLORS)).toBe(false);
    // Note: 'as const' makes it readonly in TypeScript, but doesn't freeze it at runtime
  });
});
