import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, UserProvider, LocaleProvider, AuthProvider } from './contexts';
import { Home, Dashboard, Profile, Settings, Auth, Welcome } from './pages';

function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <AuthProvider>
          <UserProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </UserProvider>
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}

export default App;
