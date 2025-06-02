import { create } from 'zustand';

export interface Connection {
  id: string;
  name: string;
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

interface ConnectionState {
  connections: Connection[];
  currentConnection: Connection | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  
  addConnection: (connection: Omit<Connection, 'id'>) => void;
  removeConnection: (id: string) => void;
  connect: (connectionId: string) => Promise<boolean>;
  disconnect: () => void;
  checkConnection: () => Promise<boolean>;
}

export const useConnectionStore = create<ConnectionState>((set, get) => ({
  connections: [],
  currentConnection: null,
  isConnected: false,
  isConnecting: false,
  connectionError: null,
  
  addConnection: (connectionData) => {
    const id = `conn_${Date.now()}`;
    const newConnection = { id, ...connectionData };
    
    set(state => ({
      connections: [...state.connections, newConnection],
    }));
    
    // Save to localStorage
    const connections = [...get().connections, newConnection];
    localStorage.setItem('db_connections', JSON.stringify(connections));
    
    return id;
  },
  
  removeConnection: (id) => {
    set(state => ({
      connections: state.connections.filter(conn => conn.id !== id),
    }));
    
    // Update localStorage
    const connections = get().connections.filter(conn => conn.id !== id);
    localStorage.setItem('db_connections', JSON.stringify(connections));
    
    // If removing the current connection, disconnect
    if (get().currentConnection?.id === id) {
      get().disconnect();
    }
  },
  
  connect: async (connectionId) => {
    const connection = get().connections.find(c => c.id === connectionId);
    if (!connection) return false;
    
    set({ isConnecting: true, connectionError: null });
    
    try {
      // In a real implementation, this would call your backend API
      // For now, we'll simulate a successful connection
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success - update state
      set({ 
        currentConnection: connection,
        isConnected: true,
        isConnecting: false,
      });
      
      // Save current connection to localStorage
      localStorage.setItem('current_connection_id', connection.id);
      
      return true;
    } catch (error) {
      set({ 
        connectionError: error instanceof Error ? error.message : 'Connection failed',
        isConnecting: false
      });
      return false;
    }
  },
  
  disconnect: () => {
    // In real implementation, this would close the backend connection
    set({ 
      currentConnection: null,
      isConnected: false,
    });
    
    localStorage.removeItem('current_connection_id');
  },
  
  checkConnection: async () => {
    // Load saved connections
    const savedConnections = localStorage.getItem('db_connections');
    if (savedConnections) {
      const connections = JSON.parse(savedConnections);
      set({ connections });
    }
    
    // Check if we have a saved connection to restore
    const currentConnectionId = localStorage.getItem('current_connection_id');
    if (currentConnectionId) {
      return await get().connect(currentConnectionId);
    }
    
    return false;
  }
}));