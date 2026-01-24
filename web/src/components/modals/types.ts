export interface WelcomeModalProps {
  isOpen: boolean;
  onCreateAnonymous: () => void;
  onRegister: () => void;
  loading?: boolean;
}

export interface ModalToggleButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  title: string;
}

export interface ModalFeatureItemProps {
  text: string;
  index?: number;
  shouldAnimate?: boolean;
}

export interface ModalHeaderProps {
  title: string;
  subtitle: string;
  shouldAnimate?: boolean;
}

export interface ModalActionButtonsProps {
  onSignIn: () => void;
  onAnonymous: () => void;
  disabled: boolean;
  signInText: string;
  anonymousText: string;
  shouldAnimate?: boolean;
}
