import { useThemeStore } from './store/themeStore';
import AppShell from './components/layout/AppShell';
import ManaDashboard from './components/dashboard/ManaDashboard';

function App() {
  return (
    <AppShell>
      <ManaDashboard />
    </AppShell>
  );
}

export default App;