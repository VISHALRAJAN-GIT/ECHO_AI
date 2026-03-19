import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Save, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AdminSettings = () => {
  const { companyData, updateCompanyData } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: companyData.name,
    tagline: companyData.tagline,
    description: companyData.description,
    email: companyData.email,
    phone: companyData.phone,
    address: companyData.address,
    services: companyData.services.join(', '),
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateCompanyData({
      ...formData,
      services: formData.services.split(',').map(s => s.trim()).filter(Boolean)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-white">ECHO_AI</span>
            <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs font-medium rounded">Admin</span>
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-white mb-6">Company Settings</h1>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="card p-5">
            <h2 className="text-base font-semibold text-white mb-4">Basic Information</h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Company Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-slate-400 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm min-h-[80px]"
              />
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-base font-semibold text-white mb-4">Contact Information</h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-slate-400 mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-base font-semibold text-white mb-2">Services</h2>
            <p className="text-xs text-slate-400 mb-3">Enter services separated by commas</p>
            <textarea
              value={formData.services}
              onChange={(e) => setFormData({...formData, services: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm min-h-[80px]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors flex items-center gap-2 text-sm">
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
            <Link to="/admin" className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors text-sm">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
