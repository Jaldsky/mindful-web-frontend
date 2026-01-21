export const MODAL_STYLES = {
  TOGGLE_BUTTON: {
    BASE: {
      width: '32px',
      height: '32px',
      fontSize: '20px',
      opacity: 0.85,
    },
    HOVER: {
      opacity: 1,
      scale: 1.15,
      background: 'rgba(76, 175, 80, 0.15)',
      boxShadow: '0 0 0 1px rgba(76, 175, 80, 0.3)',
    },
  },
  FEATURE_ITEM: {
    ICON: {
      fontSize: '16px',
      marginTop: '2px',
    },
    TEXT: {
      fontSize: '15px',
      lineHeight: '1.6',
    },
  },
  CONTAINER: {
    MAX_WIDTH: '360px',
  },
  TITLE: {
    fontSize: '32px',
    lineHeight: '1.4',
  },
} as const;

export const MODAL_ANIMATION = {
  TRANSITION_DURATION: 300,
  FADE_DELAYS: {
    FEATURES: '0.1s',
    ACTIONS: '0.15s',
    FOOTER: '0.2s',
  },
  STATES: {
    VISIBLE: {
      opacity: 1,
      scale: 1,
    },
    HIDDEN: {
      opacity: 0,
      scale: 0.98,
    },
  },
} as const;
