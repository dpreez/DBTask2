import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useConnectionStore } from '../stores/connectionStore';

export function Layout() {
  const { isConnected, currentConnection } = useConnectionStore();
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          isConnected={isConnected} 
          connectionName={currentConnection?.name || 'Not Connected'} 
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}