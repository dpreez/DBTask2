import { useNavigate } from 'react-router-dom';
import { Database, Moon, Sun, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  isConnected: boolean;
  connectionName: string;
}

function Header({ isConnected, connectionName }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  return (
    <header className="border-b border-border py-3 px-4 bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {isConnected && (
            <div className="flex items-center">
              <Database size={18} className="text-primary mr-2" />
              <div className="hidden md:flex items-center">
                <span className="font-medium text-sm text-foreground">{connectionName}</span>
                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-success/10 text-success">
                  Connected
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-input transition-colors"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          <button
            onClick={() => navigate('/settings')}
            className="p-2 rounded-full hover:bg-input transition-colors"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;