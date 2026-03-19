import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, MessageCircle, Settings, Plus, Eye, Edit, Trash2, ChevronRight, ExternalLink, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const { companyData, updateAchievement, addPortfolioItem, deletePortfolioItem, chats } = useApp();
  const navigate = useNavigate();
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [achievementValue, setAchievementValue] = useState('');
  const [showAddProject, setShowAddProject] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', category: '', image: '' });

  const handleSaveAchievement = (id) => {
    updateAchievement(id, achievementValue);
    setEditingAchievement(null);
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    addPortfolioItem(newProject);
    setNewProject({ title: '', description: '', category: '', image: '' });
    setShowAddProject(false);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">ECHO_AI</span>
            <span className="hidden sm:inline px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs font-medium rounded">Admin</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate('/admin/chat')} className="relative btn-secondary flex items-center gap-2 text-sm">
              <MessageCircle className="w-4 h-4" />
              Chats
              {chats.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {chats.length}
                </span>
              )}
            </button>
            <Link to="/admin/settings" className="btn-secondary flex items-center gap-2 text-sm">
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            <Link to="/" className="btn-secondary text-sm hidden lg:flex items-center gap-2">
              <Eye className="w-4 h-4" />
              View Site
            </Link>
            <button onClick={logout} className="text-slate-400 hover:text-white text-sm flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden p-2 text-slate-400">
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {showMobileMenu && (
          <div className="md:hidden border-t border-slate-700 px-4 py-4 space-y-3 bg-slate-800">
            <button onClick={() => { navigate('/admin/chat'); setShowMobileMenu(false); }} className="w-full btn-secondary flex items-center gap-2 justify-center">
              <MessageCircle className="w-4 h-4" />
              Chats {chats.length > 0 && `(${chats.length})`}
            </button>
            <Link to="/admin/settings" onClick={() => setShowMobileMenu(false)} className="w-full btn-secondary flex items-center gap-2 justify-center">
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            <Link to="/" onClick={() => setShowMobileMenu(false)} className="w-full btn-secondary flex items-center gap-2 justify-center">
              <Eye className="w-4 h-4" />
              View Website
            </Link>
            <button onClick={logout} className="w-full py-2 text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2 justify-center">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm">Manage your company data and chat with clients</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {companyData.achievements.map((achievement, i) => (
            <div key={i} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-xs">{achievement.label}</span>
                <span className="text-xl">{achievement.icon}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-white">
                  {achievement.value}
                </div>
                <button onClick={() => { setEditingAchievement(achievement.id); setAchievementValue(achievement.value.toString()); }} className="p-1 hover:bg-slate-700 rounded">
                  <Edit className="w-3 h-3 text-slate-400" />
                </button>
              </div>
              
              {editingAchievement === achievement.id && (
                <div className="mt-3 flex gap-2">
                  <input type="number" value={achievementValue} onChange={(e) => setAchievementValue(e.target.value)} className="input py-1 text-sm flex-1" autoFocus />
                  <button onClick={() => handleSaveAchievement(achievement.id)} className="btn-primary py-1 px-2 text-xs">Save</button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Link to="/admin/settings" className="card p-4 hover:border-indigo-500/50 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm">Company Settings</h3>
                <p className="text-xs text-slate-400">Update info</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </Link>
          
          <button onClick={() => navigate('/admin/chat')} className="card p-4 hover:border-indigo-500/50 transition-all text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm">Client Chats</h3>
                <p className="text-xs text-slate-400">{chats.length} conversations</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </button>

          <Link to="/" className="card p-4 hover:border-indigo-500/50 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <ExternalLink className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm">View Website</h3>
                <p className="text-xs text-slate-400">Preview site</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </Link>
        </div>

        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Portfolio Projects</h2>
            <button onClick={() => setShowAddProject(true)} className="btn-primary flex items-center gap-1 text-sm">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Project</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {companyData.portfolio.map((project, i) => (
              <div key={i} className="card overflow-hidden group">
                <div className="h-32 bg-slate-700 overflow-hidden relative">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => deletePortfolioItem(project.id)} className="p-2 bg-red-500/80 rounded-lg hover:bg-red-500">
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs text-indigo-400 font-medium">{project.category}</span>
                  <h3 className="font-semibold text-white mt-1">{project.title}</h3>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {showAddProject && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Add New Project</h3>
                <button onClick={() => setShowAddProject(false)} className="p-1 hover:bg-slate-700 rounded">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleAddProject} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Title</label>
                  <input type="text" value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} className="input" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Description</label>
                  <textarea value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} className="input min-h-[80px]" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Category</label>
                  <select value={newProject.category} onChange={(e) => setNewProject({...newProject, category: e.target.value})} className="select" required>
                    <option value="">Select category</option>
                    {companyData.services.map((s, i) => <option key={i} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Image URL</label>
                  <input type="url" value={newProject.image} onChange={(e) => setNewProject({...newProject, image: e.target.value})} className="input" placeholder="https://..." required />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddProject(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">Add Project</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
