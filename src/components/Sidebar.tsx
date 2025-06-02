import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Database, History, Settings, Menu, X } from 'lucide-react';
import { useConnectionStore } from '../stores/connectionStore';

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { isConnected } = useConnectionStore();
  
  const toggleSidebar = () => setCollapsed(!collapsed);
  
  const menuItems = [
    { 
      path: '/', 
      name: 'Dashboard', 
      icon: <Home size={20} />, 
      requiresConnection: true 
    },
    { 
      path: '/connect', 
      name: 'Connect', 
      icon: <Database size={20} />, 
      requiresConnection: false 
    },
    { 
      path: '/explore', 
      name: 'Explore', 
      icon: <Database size={20} />, 
      requiresConnection: true 
    },
    { 
      path: '/history', 
      name: 'History', 
      icon: <History size={20} />, 
      requiresConnection: true 
    },
    { 
      path: '/settings', 
      name: 'Settings', 
      icon: <Settings size={20} />, 
      requiresConnection: false 
    },
  ];
  
  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-card border-r border-border h-screen transition-all duration-300 flex flex-col`}>
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center">
            <svg className="w-8 h-8 text-primary\" viewBox="0 0 24 24\" fill="none\" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z\" stroke="currentColor\" strokeWidth="2\" strokeLinecap="round\" strokeLinejoin="round"/>
              <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4\" stroke="currentColor\" strokeWidth="2\" strokeLinecap="round\" strokeLinejoin="round"/>
              <path d="M12 11v4\" stroke="currentColor\" strokeWidth="2\" strokeLinecap="round\" strokeLinejoin="round"/>
              <path d="M9 13h6\" stroke="currentColor\" strokeWidth="2\" strokeLinecap="round\" strokeLinejoin="round"/>
            </svg>
            <h1 className="ml-2 font-bold text-lg text-foreground">NL Assistant</h1>
          </div>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-input transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>
      
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {menuItems.map(item => (
            (!item.requiresConnection || isConnected) && (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2 rounded-md transition-colors
                    ${isActive ? 'bg-primary text-white' : 'hover:bg-input'}
                    ${collapsed ? 'justify-center' : ''}
                  `}
                >
                  <span>{item.icon}</span>
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </NavLink>
              </li>
            )
          ))}
        </ul>
      </nav>
      
      <div className="p-4 text-xs text-foreground/60 border-t border-border">
        {!collapsed && <p>MySQL NL Assistant v1.0</p>}
      </div>
    </aside>
  );
}

export default Sidebar;