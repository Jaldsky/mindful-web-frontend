export interface NavigationItem {
  path: string;
  labelKey: string;
  icon: React.ComponentType<{ size?: string | number }>;
}

export interface LayoutProps {
  children: React.ReactNode;
}

export interface HeaderProps {
  children?: React.ReactNode;
}
