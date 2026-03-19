import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, MessageCircle, ChevronRight, Menu, X, LogOut, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useEffect, useState } from 'react';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const { companyData, startChat, getChatsForCustomer } = useApp();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    if (user) {
      const chats = getChatsForCustomer(user.id);
      if (chats.length === 0) {
        startChat(user.id, user.name, user.email, false);
      }
    }
  }, [user]);

  const handleContact = () => {
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">{companyData.name}</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-3">
            <button onClick={handleContact} className="btn-primary flex items-center gap-2 text-sm">
              <MessageCircle className="w-4 h-4" />
              Chat with Us
            </button>
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
            <button onClick={() => { handleContact(); setShowMobileMenu(false); }} className="w-full btn-primary flex items-center gap-2 justify-center">
              <MessageCircle className="w-4 h-4" />
              Chat with Us
            </button>
            <button onClick={logout} className="w-full py-2 text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2 justify-center">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Welcome, {user?.name}!</h1>
          <p className="text-slate-400 text-sm">Here's what we're working on</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {companyData.achievements.map((achievement, i) => (
            <div key={i} className="card p-4 text-center">
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <div className="text-2xl font-bold text-white">{achievement.value}</div>
              <div className="text-xs text-slate-400 mt-1">{achievement.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {companyData.services.map((service, i) => (
              <div key={i} className="card p-4 hover:border-indigo-500/50 transition-all cursor-pointer">
                <h3 className="font-semibold text-white mb-2">{service}</h3>
                <p className="text-sm text-slate-400 mb-3">Professional service</p>
                <button onClick={handleContact} className="text-indigo-400 text-sm flex items-center gap-1 hover:text-indigo-300">
                  Discuss <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Our Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companyData.portfolio.map((project, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="h-40 bg-slate-700 overflow-hidden">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <span className="text-xs text-indigo-400 font-medium">{project.category}</span>
                  <h3 className="font-semibold text-white mt-1">{project.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-6 text-center">
          <h2 className="text-xl font-bold text-white mb-3">Ready to start a project?</h2>
          <p className="text-slate-400 mb-5">Let's chat about how we can help your business grow</p>
          <button onClick={handleContact} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2 mx-auto">
            <MessageCircle className="w-5 h-5" />
            Start a Conversation
          </button>
        </section>
      </div>
    </div>
  );
};

export default CustomerDashboard;
