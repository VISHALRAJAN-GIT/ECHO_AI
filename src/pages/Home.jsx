import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, MessageCircle, ChevronRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">ECHO_AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/contact" className="text-slate-300 hover:text-white transition-colors font-medium text-sm px-3 py-2">
              Contact
            </Link>
            <Link to="/login" className="text-slate-300 hover:text-white transition-colors font-medium text-sm px-3 py-2">
              Sign In
            </Link>
            <Link to="/register" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all flex items-center gap-1 text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
        
        <div className="max-w-4xl mx-auto relative text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Welcome to
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ECHO_AI
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-400 mb-8 max-w-2xl mx-auto px-4">
            Intelligent AI solutions for your business
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4">
            <Link to="/register" className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/contact" className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all border border-slate-700 text-sm sm:text-base">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to work with us?</h2>
          <p className="text-slate-400 mb-8">
            Get in touch and let's discuss how we can help your business grow
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all">
            <MessageCircle className="w-5 h-5" />
            Start a Conversation
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-white font-semibold text-sm">ECHO_AI</span>
          </div>
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} ECHO_AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
