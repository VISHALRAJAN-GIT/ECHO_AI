import { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, X, Edit2, Trash2, AlertTriangle, Download, Ticket, Clock, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Tickets = () => {
  const { tickets, customers, createTicket, updateTicket, deleteTicket, loading } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customer_id: '',
    priority: 'medium',
    category: 'general_inquiry',
    status: 'open',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      customer_id: customers[0]?.id || '',
      priority: 'medium',
      category: 'general_inquiry',
      status: 'open',
    });
    setEditingTicket(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (ticket) => {
    setFormData({
      title: ticket.title,
      description: ticket.description,
      customer_id: ticket.customer_id,
      priority: ticket.priority,
      category: ticket.category,
      status: ticket.status,
    });
    setEditingTicket(ticket);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTicket) {
        await updateTicket(editingTicket.id, formData);
      } else {
        await createTicket(formData);
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Failed to save ticket:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await deleteTicket(id);
      } catch (err) {
        console.error('Failed to delete ticket:', err);
      }
    }
  };

  const handleStatusChange = async (ticket, newStatus) => {
    try {
      await updateTicket(ticket.id, { status: newStatus });
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || ticket.status === statusFilter;
    const matchesPriority = !priorityFilter || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'badge-info';
      case 'in_progress': return 'badge-warning';
      case 'escalated': return 'badge-danger';
      case 'resolved': return 'badge-success';
      case 'closed': return 'badge-purple';
      default: return 'badge-info';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'medium': return 'badge-warning';
      case 'low': return 'badge-purple';
      default: return 'badge-purple';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = [
    { label: 'Open', value: tickets.filter(t => t.status === 'open').length, color: 'blue' },
    { label: 'In Progress', value: tickets.filter(t => t.status === 'in_progress').length, color: 'amber' },
    { label: 'Escalated', value: tickets.filter(t => t.status === 'escalated').length, color: 'red' },
    { label: 'Resolved', value: tickets.filter(t => t.status === 'resolved').length, color: 'emerald' },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Tickets</h1>
          <p className="text-slate-400 mt-1">Manage and track customer support requests</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Ticket
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card cursor-pointer hover:border-slate-600/50 transition-colors" onClick={() => setStatusFilter(stat.label.toLowerCase().replace(' ', '_'))}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">{stat.label}</span>
              <div className={`w-2 h-2 rounded-full bg-${stat.color}-500`} />
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="card p-4 mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tickets by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12"
            />
          </div>
          <select 
            className="select w-40"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select 
            className="select w-40"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priority</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-800/50">
                <th className="p-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Ticket</th>
                <th className="p-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="p-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Priority</th>
                <th className="p-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="p-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Created</th>
                <th className="p-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Ticket className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-400 mb-2">{loading ? 'Loading...' : 'No tickets found'}</p>
                    {!loading && (
                      <button onClick={openCreateModal} className="btn-primary">
                        Create Your First Ticket
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr 
                    key={ticket.id} 
                    className={`table-row ${ticket.priority === 'critical' ? 'bg-red-500/5' : ''}`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {ticket.priority === 'critical' && (
                          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                        )}
                        <div>
                          <p className="font-medium text-white">{ticket.title}</p>
                          <p className="text-xs text-slate-500">#{ticket.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-xs font-bold text-white">
                          {ticket.customer_id?.toString().charAt(0) || 'C'}
                        </div>
                        <span className="text-slate-300">Customer #{ticket.customer_id}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <select 
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(ticket, e.target.value)}
                        className={`${getStatusColor(ticket.status)} border-0 cursor-pointer text-xs py-1.5`}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="escalated">Escalated</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority?.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-400 text-sm capitalize">
                        {ticket.category?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Clock className="w-3 h-3" />
                        {formatDate(ticket.created_at)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button 
                          onClick={() => openEditModal(ticket)}
                          className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-slate-400" />
                        </button>
                        <button 
                          onClick={() => handleDelete(ticket.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingTicket ? 'Edit Ticket' : 'Create Ticket'}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                <input 
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="input"
                  placeholder="Brief description of the issue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="input min-h-[100px] resize-none"
                  placeholder="Detailed description of the ticket..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Customer</label>
                  <select 
                    value={formData.customer_id}
                    onChange={(e) => setFormData({...formData, customer_id: parseInt(e.target.value)})}
                    className="select"
                    required
                  >
                    <option value="">Select customer</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="select"
                  >
                    <option value="general_inquiry">General Inquiry</option>
                    <option value="technical">Technical</option>
                    <option value="billing">Billing</option>
                    <option value="feature_request">Feature Request</option>
                    <option value="complaint">Complaint</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                  <select 
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="select"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="select"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="escalated">Escalated</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingTicket ? 'Update Ticket' : 'Create Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
