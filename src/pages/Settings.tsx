import { useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Database, Shield, Code, RefreshCw } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [apiEndpoint, setApiEndpoint] = useState('http://localhost:5000/api');
  const [maxResults, setMaxResults] = useState(20);
  const [enableLLM, setEnableLLM] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate saving
    setTimeout(() => {
      setSaving(false);
      toast.success('Settings saved successfully');
    }, 800);
  };
  
  const resetSettings = () => {
    if (confirm('Reset all settings to default values?')) {
      setApiEndpoint('http://localhost:5000/api');
      setMaxResults(20);
      setEnableLLM(true);
      toast.success('Settings reset to defaults');
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground flex items-center justify-center">
          <SettingsIcon size={24} className="mr-2 text-primary" />
          Settings
        </h1>
        <p className="text-foreground/70">Configure your application preferences</p>
      </div>
      
      <form onSubmit={handleSaveSettings}>
        <div className="space-y-6">
          {/* Appearance */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              {theme === 'light' ? (
                <Sun size={20} className="mr-2 text-primary" />
              ) : (
                <Moon size={20} className="mr-2 text-primary" />
              )}
              Appearance
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center justify-between">
                  <span className="font-medium">Theme</span>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-input"
                  >
                    <span className="sr-only">Toggle theme</span>
                    <span
                      className={`${
                        theme === 'dark' ? 'translate-x-6 bg-primary' : 'translate-x-1 bg-foreground/20'
                      } inline-block h-4 w-4 transform rounded-full transition`}
                    />
                  </button>
                </label>
                <p className="text-sm text-foreground/70 mt-1">
                  {theme === 'light' ? 'Light mode is currently active' : 'Dark mode is currently active'}
                </p>
              </div>
            </div>
          </div>
          
          {/* API Connection */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Database size={20} className="mr-2 text-primary" />
              API Connection
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="api-endpoint">
                  Backend API Endpoint
                </label>
                <input
                  id="api-endpoint"
                  type="text"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  className="input w-full"
                  placeholder="http://localhost:5000/api"
                />
                <p className="text-sm text-foreground/70 mt-1">
                  URL of your Python backend API
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="max-results">
                  Maximum Results
                </label>
                <input
                  id="max-results"
                  type="number"
                  min="1"
                  max="100"
                  value={maxResults}
                  onChange={(e) => setMaxResults(parseInt(e.target.value))}
                  className="input w-full"
                />
                <p className="text-sm text-foreground/70 mt-1">
                  Maximum number of results to return per query
                </p>
              </div>
            </div>
          </div>
          
          {/* Advanced Settings */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Code size={20} className="mr-2 text-primary" />
              Advanced Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center justify-between">
                  <span className="font-medium">Use LLM for SQL Generation</span>
                  <button
                    type="button"
                    onClick={() => setEnableLLM(!enableLLM)}
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-input"
                  >
                    <span className="sr-only">Enable LLM</span>
                    <span
                      className={`${
                        enableLLM ? 'translate-x-6 bg-primary' : 'translate-x-1 bg-foreground/20'
                      } inline-block h-4 w-4 transform rounded-full transition`}
                    />
                  </button>
                </label>
                <p className="text-sm text-foreground/70 mt-1">
                  Use advanced language model for better SQL generation (requires more resources)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium">
                  Security Level
                </label>
                <div className="mt-2">
                  <div className="flex items-center">
                    <input
                      id="security-standard"
                      name="security-level"
                      type="radio"
                      defaultChecked
                      className="h-4 w-4 text-primary border-border focus:ring-primary"
                    />
                    <label htmlFor="security-standard" className="ml-2 block text-sm">
                      Standard (SELECT queries only)
                    </label>
                  </div>
                  <div className="flex items-center mt-2">
                    <input
                      id="security-advanced"
                      name="security-level"
                      type="radio"
                      className="h-4 w-4 text-primary border-border focus:ring-primary"
                    />
                    <label htmlFor="security-advanced" className="ml-2 block text-sm">
                      Advanced (Allow whitelisted commands)
                    </label>
                  </div>
                </div>
                <p className="text-sm text-foreground/70 mt-1">
                  Configure which SQL commands are allowed
                </p>
              </div>
            </div>
          </div>
          
          {/* Security */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Shield size={20} className="mr-2 text-primary" />
              Security
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center justify-between">
                  <span className="font-medium">Store Credentials Locally</span>
                  <button
                    type="button"
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-input"
                  >
                    <span className="sr-only">Store credentials</span>
                    <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-primary transition" />
                  </button>
                </label>
                <p className="text-sm text-foreground/70 mt-1">
                  Store connection credentials in browser local storage (encrypted)
                </p>
              </div>
              
              <div>
                <label className="flex items-center justify-between">
                  <span className="font-medium">Save Query History</span>
                  <button
                    type="button"
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-input"
                  >
                    <span className="sr-only">Save history</span>
                    <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-primary transition" />
                  </button>
                </label>
                <p className="text-sm text-foreground/70 mt-1">
                  Store previous queries and results for future reference
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={resetSettings}
              className="btn btn-outline flex items-center gap-2"
            >
              <RefreshCw size={16} />
              <span>Reset to Defaults</span>
            </button>
            
            <button
              type="submit"
              className="btn btn-primary flex items-center gap-2"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Settings</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Settings;