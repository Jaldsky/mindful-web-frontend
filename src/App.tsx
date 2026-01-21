import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, UserProvider, LocaleProvider } from './contexts';
import { Home, Dashboard, Profile, Settings } from './pages';

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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}

export default App;
