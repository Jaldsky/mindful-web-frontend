import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Settings, Moon, Sun, User, Home, BarChart3 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { SettingsSidebar } from './SettingsSidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const isDashboard = location.pathname === '/dashboard';
  const isProfile = location.pathname === '/profile';

  return (
    <div className="min-h-screen bg-background-tertiary font-sans">
      {/* Header */}
      <header className="bg-background-primary border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Activity className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">Mindful Web</h1>
          </Link>
          
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-2">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !isDashboard
                    ? 'bg-background-secondary text-primary'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-background-secondary'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Home size={16} />
                  <span>Home</span>
                </div>
              </Link>
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDashboard
                    ? 'bg-background-secondary text-primary'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-background-secondary'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} />
                  <span>Dashboard</span>
                </div>
              </Link>
              <Link
                to="/profile"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isProfile
                    ? 'bg-background-secondary text-primary'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-background-secondary'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>Личный кабинет</span>
                </div>
              </Link>
            </nav>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-background-secondary text-slate-600 dark:text-slate-300 transition-colors"
              title="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-lg hover:bg-background-secondary text-slate-600 dark:text-slate-300 transition-colors"
              title="Settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Settings Sidebar */}
      <SettingsSidebar isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

