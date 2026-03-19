import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10" />
      
      <div className="relative text-center px-4">
        <div className="mb-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl sm:rounded-3xl animate-pulse opacity-20 blur-xl" />
            <div className="relative w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30">
              <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-white animate-pulse" />
            </div>
            <div className="absolute -inset-2 sm:-inset-4 border border-indigo-500/30 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 tracking-wider">
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            ECHO_AI
          </span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg mb-8">AI-Powered Solutions</p>

        <div className="w-48 sm:w-64 mx-auto">
          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-slate-500 text-sm mt-2">{progress}%</p>
        </div>
      </div>

      <div className="absolute bottom-6 sm:bottom-8 text-slate-500 text-xs sm:text-sm px-4 text-center">
        Loading your experience...
      </div>
    </div>
  );
};

export default SplashScreen;
