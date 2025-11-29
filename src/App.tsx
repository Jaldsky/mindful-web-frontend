import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import { LocaleProvider } from './contexts/LocaleContext';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { NotificationsSettings } from './pages/settings/NotificationsSettings';
import { ExtensionSettings } from './pages/settings/ExtensionSettings';

function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <UserProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/notifications" element={<NotificationsSettings />} />
              <Route path="/settings/extension" element={<ExtensionSettings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}

export default App;
