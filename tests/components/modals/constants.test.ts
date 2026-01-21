import { describe, it, expect } from 'vitest';
import { MODAL_STYLES, MODAL_ANIMATION } from '../../../src/components/modals/constants';

describe('MODAL_STYLES', () => {
  it('has toggle button base styles', () => {
    expect(MODAL_STYLES.TOGGLE_BUTTON.BASE).toBeDefined();
    expect(MODAL_STYLES.TOGGLE_BUTTON.BASE.width).toBe('32px');
    expect(MODAL_STYLES.TOGGLE_BUTTON.BASE.height).toBe('32px');
  });

  it('has toggle button hover styles', () => {
    expect(MODAL_STYLES.TOGGLE_BUTTON.HOVER).toBeDefined();
    expect(MODAL_STYLES.TOGGLE_BUTTON.HOVER.opacity).toBe(1);
    expect(MODAL_STYLES.TOGGLE_BUTTON.HOVER.scale).toBe(1.15);
  });

  it('has feature item styles', () => {
    expect(MODAL_STYLES.FEATURE_ITEM).toBeDefined();
    expect(MODAL_STYLES.FEATURE_ITEM.ICON).toBeDefined();
    expect(MODAL_STYLES.FEATURE_ITEM.TEXT).toBeDefined();
  });

  it('has container max width', () => {
    expect(MODAL_STYLES.CONTAINER.MAX_WIDTH).toBe('360px');
  });

  it('has title styles', () => {
    expect(MODAL_STYLES.TITLE.fontSize).toBe('32px');
    expect(MODAL_STYLES.TITLE.lineHeight).toBe('1.4');
  });
});

describe('MODAL_ANIMATION', () => {
  it('has transition duration', () => {
    expect(MODAL_ANIMATION.TRANSITION_DURATION).toBe(300);
  });

  it('has fade delays', () => {
    expect(MODAL_ANIMATION.FADE_DELAYS.FEATURES).toBe('0.1s');
    expect(MODAL_ANIMATION.FADE_DELAYS.ACTIONS).toBe('0.15s');
    expect(MODAL_ANIMATION.FADE_DELAYS.FOOTER).toBe('0.2s');
  });

  it('has visible and hidden states', () => {
    expect(MODAL_ANIMATION.STATES.VISIBLE.opacity).toBe(1);
    expect(MODAL_ANIMATION.STATES.VISIBLE.scale).toBe(1);
    expect(MODAL_ANIMATION.STATES.HIDDEN.opacity).toBe(0);
    expect(MODAL_ANIMATION.STATES.HIDDEN.scale).toBe(0.98);
  });
});
