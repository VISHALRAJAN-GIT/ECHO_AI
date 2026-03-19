import { useEffect } from 'react';
import { RefreshCw, CheckCircle, Clock, Crown, Zap, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Analytics = () => {
  const { dashboard, ticketAnalytics, fetchDashboard, fetchTicketAnalytics, loading, tickets } = useApp();

  useEffect(() => {
    fetchDashboard();
    fetchTicketAnalytics();
  }, [fetchDashboard, fetchTicketAnalytics]);

  const categoryData = ticketAnalytics?.by_category || [];
  const priorityData = ticketAnalytics?.by_priority || [];
  const totalTickets = tickets.length || 0;

  const stats = [
    { 
      label: 'Total Tickets', 
      value: totalTickets, 
      icon: Users, 
      color: 'indigo'
    },
    { 
      label: 'Resolved', 
      value: tickets.filter(t => t.status === 'resolved').length, 
      icon: CheckCircle, 
      color: 'emerald'
    },
    { 
      label: 'Avg Resolution', 
      value: dashboard?.avg_resolution_hours ? `${dashboard.avg_resolution_hours}h` : 'N/A', 
      icon: Clock, 
      color: 'purple'
    },
    { 
      label: 'Escalated', 
      value: tickets.filter(t => t.status === 'escalated').length, 
      icon: Crown, 
      color: 'red'
    },
  ];

  const getCategoryColor = (category) => {
    const colors = {
      technical: '#6366f1',
      billing: '#10b981',
      feature_request: '#f59e0b',
      general_inquiry: '#8b5cf6',
      complaint: '#ef4444',
      other: '#64748b',
    };
    return colors[category] || '#64748b';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: '#ef4444',
      high: '#f97316',
      medium: '#eab308',
      low: '#64748b',
    };
    return colors[priority] || '#64748b';
  };

  const categories = categoryData.length > 0 ? categoryData : [];
  const priorities = priorityData.length > 0 ? priorityData : [];
  const totalPriority = priorities.reduce((s, p) => s + p.count, 0) || 1;
  const circumference = 251.2;

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 mt-1">Your support metrics</p>
        </div>
        <button
          onClick={() => { fetchDashboard(); fetchTicketAnalytics(); }}
          className="btn-secondary flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-400 text-sm font-medium">{stat.label}</span>
              <div className={`p-2 rounded-xl bg-${stat.color}-500/10`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-white mb-6">Tickets by Category</h3>
          {categories.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p>No category data yet</p>
              <p className="text-sm text-slate-500 mt-1">Create tickets to see analytics</p>
            </div>
          ) : (
            <div className="flex items-center gap-8">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="16" />
                  {categories.map((cat, index) => {
                    const total = categories.reduce((s, c) => s + c.count, 0);
                    const percentage = (cat.count / total) * 100;
                    const offset = categories.slice(0, index).reduce((acc, c) => acc + (c.count / total) * circumference, 0);
                    return (
                      <circle
                        key={cat.category}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={getCategoryColor(cat.category)}
                        strokeWidth="16"
                        strokeDasharray={`${(percentage / 100) * circumference} ${circumference}`}
                        strokeDashoffset={-offset}
                        strokeLinecap="round"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{categories.reduce((s, c) => s + c.count, 0)}</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                {categories.map(cat => (
                  <div key={cat.category} className="flex items-center justify-between p-2 hover:bg-slate-700/30 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: getCategoryColor(cat.category) }} />
                      <span className="text-sm capitalize text-slate-300">{cat.category?.replace('_', ' ')}</span>
                    </div>
                    <span className="font-semibold text-white">{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-white mb-6">Tickets by Priority</h3>
          {priorities.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p>No priority data yet</p>
              <p className="text-sm text-slate-500 mt-1">Create tickets to see analytics</p>
            </div>
          ) : (
            <div className="space-y-5">
              {priorities.map(p => (
                <div key={p.priority}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="capitalize text-slate-300">{p.priority}</span>
                    <span className="font-semibold text-white">{p.count}</span>
                  </div>
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(p.count / totalPriority) * 100}%`,
                        backgroundColor: getPriorityColor(p.priority)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
