import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Ticket, Users, Settings, Sparkles, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { id: 'conversations', icon: MessageSquare, label: 'Conversations', path: '/conversations' },
    { id: 'tickets', icon: Ticket, label: 'Tickets', path: '/tickets' },
    { id: 'customers', icon: Users, label: 'Customers', path: '/customers' },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800/50 border-r border-slate-700/50 flex flex-col h-screen fixed left-0 top-0">
      
      <div className="relative z-10">
        <div className="p-6 border-b border-slate-700/50">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg block text-white">SupportDesk</span>
              <span className="text-xs text-slate-400">Admin Panel</span>
            </div>
          </Link>
        </div>

        <div className="px-4 py-6">
          <nav className="space-y-1">
            {navItems.map(item => (
              <Link
                key={item.id}
                to={item.path}
                className={`${isActive(item.path) ? 'nav-item-active' : 'nav-item'}`}
              >
                <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-indigo-400' : ''}`} />
                <span className="flex-1">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="relative z-10 mt-auto border-t border-slate-700/50">
        <div className="p-4">
          <div 
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-all duration-200 cursor-pointer group"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || ''}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
          </div>
          
          {showUserMenu && (
            <div className="mt-2 p-2 bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700/50">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
