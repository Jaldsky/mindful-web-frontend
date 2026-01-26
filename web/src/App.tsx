import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, UserProvider, LocaleProvider, AuthProvider, useAuth } from './contexts';
import { Home, Dashboard, Profile, Settings, Auth, Welcome, Terms, Privacy } from './pages';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return <>{children}</>;
  }

  const allowedPaths = ['/auth', '/welcome', '/terms', '/privacy'];
  if (allowedPaths.includes(location.pathname)) {
    return <>{children}</>;
  }

  if (status === 'welcome' && location.pathname !== '/welcome') {
    return <Navigate to="/welcome" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthGuard>
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthGuard>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <UserProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </UserProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}

export default App;
