import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Plus, Trash2, Link, ExternalLink } from 'lucide-react';
import { useConnectionStore, Connection } from '../stores/connectionStore';
import toast from 'react-hot-toast';

function Connect() {
  const navigate = useNavigate();
  const { 
    connections, 
    addConnection, 
    removeConnection,
    connect,
    isConnecting,
    connectionError
  } = useConnectionStore();
  
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'port' ? parseInt(value) || 3306 : value
    }));
  };
  
  const handleAddConnection = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.host || !formData.user || !formData.database) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // Add connection
    addConnection(formData);
    
    // Reset form
    setFormData({
      name: '',
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: ''
    });
    
    setShowNewForm(false);
    toast.success('Connection added successfully');
  };
  
  const handleConnect = async (connectionId: string) => {
    const success = await connect(connectionId);
    
    if (success) {
      toast.success('Connected successfully');
      navigate('/');
    } else {
      toast.error(connectionError || 'Connection failed');
    }
  };
  
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeConnection(id);
    toast.success('Connection removed');
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Database Connections</h1>
        <p className="text-foreground/70">Connect to your MySQL database to start querying</p>
      </div>
      
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-foreground">Saved Connections</h2>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={16} />
          <span>New Connection</span>
        </button>
      </div>
      
      {showNewForm && (
        <div className="bg-card rounded-lg border border-border p-6 slide-up">
          <h3 className="text-lg font-medium mb-4">Add New Connection</h3>
          <form onSubmit={handleAddConnection} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Connection Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="My Database"
                  className="input w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Host*
                </label>
                <input
                  type="text"
                  name="host"
                  value={formData.host}
                  onChange={handleInputChange}
                  placeholder="localhost"
                  className="input w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Port
                </label>
                <input
                  type="number"
                  name="port"
                  value={formData.port}
                  onChange={handleInputChange}
                  placeholder="3306"
                  className="input w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Database Name*
                </label>
                <input
                  type="text"
                  name="database"
                  value={formData.database}
                  onChange={handleInputChange}
                  placeholder="my_database"
                  className="input w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Username*
                </label>
                <input
                  type="text"
                  name="user"
                  value={formData.user}
                  onChange={handleInputChange}
                  placeholder="root"
                  className="input w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="input w-full"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Save Connection
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="space-y-4">
        {connections.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <Database size={48} className="mx-auto text-foreground/30 mb-4" />
            <h3 className="text-lg font-medium">No Connections Yet</h3>
            <p className="text-foreground/70 mt-2 mb-4">
              Add a connection to get started with your database
            </p>
            <button
              onClick={() => setShowNewForm(true)}
              className="btn btn-primary"
            >
              Add Your First Connection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connections.map((conn: Connection) => (
              <div
                key={conn.id}
                onClick={() => handleConnect(conn.id)}
                className="bg-card rounded-lg border border-border p-4 hover:border-primary transition-colors cursor-pointer group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Database size={18} className="text-primary mr-2" />
                    <h3 className="font-medium truncate">{conn.name}</h3>
                  </div>
                  <button
                    onClick={(e) => handleDelete(conn.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-error/10 hover:text-error rounded transition-opacity"
                    aria-label="Delete connection"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="mt-3 space-y-1">
                  <p className="text-sm text-foreground/70 truncate">
                    {conn.database}@{conn.host}:{conn.port}
                  </p>
                  <p className="text-sm text-foreground/70 truncate">
                    User: {conn.user}
                  </p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
                  {isConnecting ? (
                    <span className="text-xs text-foreground/70 flex items-center">
                      <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                      Connecting...
                    </span>
                  ) : (
                    <span className="text-xs text-foreground/70">
                      Click to connect
                    </span>
                  )}
                  <div className="flex items-center text-primary">
                    <Link size={14} className="mr-1" />
                    <span className="text-xs font-medium">Connect</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-medium mb-4 flex items-center">
          <ExternalLink size={20} className="mr-2 text-primary" />
          Need to Set Up Your MySQL Backend?
        </h2>
        <p className="text-foreground/70 mb-4">
          This web interface connects to your Python-based MySQL assistant. Make sure you've set up the backend API first.
        </p>
        <div className="bg-primary/5 rounded-md p-4 border border-primary/20">
          <h3 className="font-medium text-primary mb-2">Quick Setup</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Ensure your MySQL server is running</li>
            <li>Start your Python API server (the one from the code you shared)</li>
            <li>Create a connection in this interface with the same parameters</li>
            <li>Start querying your database in natural language!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Connect;