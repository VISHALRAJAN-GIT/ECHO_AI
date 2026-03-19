import { useEffect } from 'react';
import { Users, Ticket, Clock, AlertTriangle, RefreshCw, Activity, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Dashboard = () => {
  const { dashboard, fetchDashboard, loading, tickets, customers } = useApp();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading && !dashboard) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { 
      label: 'Customers', 
      value: customers.length, 
      icon: Users, 
      color: 'indigo',
      link: '/customers'
    },
    { 
      label: 'Open Tickets', 
      value: tickets.filter(t => t.status === 'open').length, 
      icon: Ticket, 
      color: 'amber',
      link: '/tickets'
    },
    { 
      label: 'In Progress', 
      value: tickets.filter(t => t.status === 'in_progress').length, 
      icon: Activity, 
      color: 'blue',
      link: '/tickets'
    },
    { 
      label: 'Escalated', 
      value: tickets.filter(t => t.status === 'escalated').length, 
      icon: AlertTriangle, 
      color: 'red',
      link: '/tickets'
    },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Manage your support operations</p>
        </div>
        <button 
          onClick={fetchDashboard}
          className="btn-secondary flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <Link 
            key={i} 
            to={stat.link}
            className="stat-card group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-400 text-sm font-medium">{stat.label}</span>
              <div className={`p-2 rounded-xl bg-${stat.color}-500/10`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-white">Recent Tickets</h3>
            <Link to="/tickets" className="text-sm text-indigo-400 hover:text-indigo-300">View all →</Link>
          </div>
          {tickets.length === 0 ? (
            <div className="text-center py-8">
              <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No tickets yet</p>
              <Link to="/tickets" className="btn-primary mt-4 inline-block">Create First Ticket</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.slice(0, 5).map(ticket => (
                <div key={ticket.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      ticket.status === 'open' ? 'bg-blue-500' :
                      ticket.status === 'in_progress' ? 'bg-amber-500' :
                      ticket.status === 'escalated' ? 'bg-red-500' :
                      ticket.status === 'resolved' ? 'bg-emerald-500' :
                      'bg-slate-500'
                    }`} />
                    <div>
                      <p className="font-medium text-sm text-white">{ticket.title}</p>
                      <p className="text-xs text-slate-500">#{ticket.id}</p>
                    </div>
                  </div>
                  <span className={`badge ${
                    ticket.status === 'open' ? 'badge-info' :
                    ticket.status === 'in_progress' ? 'badge-warning' :
                    ticket.status === 'escalated' ? 'badge-danger' :
                    ticket.status === 'resolved' ? 'badge-success' :
                    'badge-info'
                  }`}>
                    {ticket.status?.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-white">Recent Customers</h3>
            <Link to="/customers" className="text-sm text-indigo-400 hover:text-indigo-300">View all →</Link>
          </div>
          {customers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No customers yet</p>
              <Link to="/customers" className="btn-primary mt-4 inline-block">Add First Customer</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {customers.slice(0, 5).map(customer => (
                <div key={customer.id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-sm font-bold text-white">
                    {customer.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-white">{customer.name}</p>
                    <p className="text-xs text-slate-500">{customer.email}</p>
                  </div>
                  <span className={`badge ${customer.is_active ? 'badge-success' : 'badge-info'}`}>
                    {customer.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 card p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-white mb-1">Quick Actions</h3>
            <p className="text-sm text-slate-400">Common tasks at your fingertips</p>
          </div>
          <div className="flex gap-3">
            <Link to="/tickets" className="btn-primary flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              New Ticket
            </Link>
            <Link to="/customers" className="btn-secondary flex items-center gap-2">
              <Users className="w-4 h-4" />
              Add Customer
            </Link>
            <Link to="/conversations" className="btn-secondary flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Conversations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
