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
  TRANSITION_DURATION: 600,
  FADE_DELAYS: {
    HEADER: '0.1s',
    FEATURE1: '0.18s',
    FEATURE2: '0.26s',
    FEATURE3: '0.34s',
    ACTIONS: '0.42s',
    FOOTER: '0.5s',
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
