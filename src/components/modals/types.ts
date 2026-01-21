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
}

export interface ModalHeaderProps {
  title: string;
  subtitle: string;
  onToggleTheme: () => void;
  onToggleLocale: () => void;
  themeIcon: React.ReactNode;
  themeTitle: string;
  localeIcon: React.ReactNode;
  localeTitle: string;
}

export interface ModalActionButtonsProps {
  onSignIn: () => void;
  onAnonymous: () => void;
  disabled: boolean;
  signInText: string;
  anonymousText: string;
}
