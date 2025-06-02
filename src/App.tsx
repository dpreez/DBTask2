import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Connect from './pages/Connect';
import Explore from './pages/Explore';
import History from './pages/History';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { useConnectionStore } from './stores/connectionStore';

function App() {
  const { isConnected, checkConnection } = useConnectionStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have an active connection
    const initialize = async () => {
      await checkConnection();
      setLoading(false);
    };
    
    initialize();
  }, [checkConnection]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-foreground">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={isConnected ? <Dashboard /> : <Navigate to="/connect\" replace />} />
          <Route path="connect" element={<Connect />} />
          <Route path="explore" element={isConnected ? <Explore /> : <Navigate to="/connect\" replace />} />
          <Route path="history" element={isConnected ? <History /> : <Navigate to="/connect\" replace />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;