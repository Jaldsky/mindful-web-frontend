import { Dashboard } from './pages/Dashboard';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Dashboard />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
