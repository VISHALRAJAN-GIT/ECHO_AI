import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Mail, Phone, User, DollarSign, TrendingUp, Users, Activity, MoreVertical, Filter, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Customers = () => {
  const { customers, createCustomer, updateCustomer, deleteCustomer, loading } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      is_active: true,
    });
    setEditingCustomer(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (customer) => {
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      is_active: customer.is_active,
    });
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, formData);
      } else {
        await createCustomer(formData);
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Failed to save customer:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      try {
        await deleteCustomer(id);
      } catch (err) {
        console.error('Failed to delete customer:', err);
      }
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone?.includes(searchQuery)
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const totalRevenue = customers.reduce((sum, c) => sum + (c.lifetime_value || 0), 0);
  const avgLTV = customers.length > 0 ? totalRevenue / customers.length : 0;

  const stats = [
    { label: 'Total Customers', value: customers.length, icon: Users, color: 'indigo' },
    { label: 'Active Customers', value: customers.filter(c => c.is_active).length, icon: Activity, color: 'emerald' },
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'amber' },
    { label: 'Avg LTV', value: formatCurrency(avgLTV), icon: TrendingUp, color: 'purple' },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Customers</h1>
          <p className="text-slate-400 mt-1">Manage your customer relationships and track revenue</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="flex justify-between items-start mb-3">
              <span className="text-slate-400 text-sm font-medium">{stat.label}</span>
              <div className={`p-2 rounded-xl bg-${stat.color}-500/10`}>
                <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
              </div>
            </div>
            <div className="text-xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="card p-4 mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="card p-12 text-center">
          {loading ? (
            <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
          ) : (
            <>
              <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-400 mb-2">No customers found</p>
              <p className="text-sm text-slate-500 mb-4">Get started by adding your first customer</p>
              <button onClick={openCreateModal} className="btn-primary">
                Add Your First Customer
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCustomers.map(customer => (
            <div key={customer.id} className="card-hover p-6 group">
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-indigo-500/20">
                    {customer.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">{customer.name}</h3>
                    <span className={`badge ${customer.is_active ? 'badge-success' : 'badge-info'}`}>
                      {customer.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-3 text-slate-400">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-3 text-slate-400">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Lifetime Value</p>
                  <p className="font-semibold text-emerald-400">{formatCurrency(customer.lifetime_value)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Joined</p>
                  <p className="text-sm text-white">{formatDate(customer.created_at)}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openEditModal(customer)}
                  className="flex-1 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm font-medium text-white transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(customer.id)}
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md p-6 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingCustomer ? 'Edit Customer' : 'Add Customer'}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input"
                  placeholder="Sarah Chen"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="input"
                  placeholder="sarah@company.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone (Optional)</label>
                <input 
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="input"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl">
                <input 
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="is_active" className="text-sm text-slate-300">Active customer (currently using your service)</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingCustomer ? 'Update Customer' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
