import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Sparkles, Menu, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const Chat = ({ isAdmin = false }) => {
  const { user } = useAuth();
  const { chats, activeChat, setActiveChat, startChat, sendMessage, getChatsForAdmin, getChatsForCustomer } = useApp();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);

  const displayChats = isAdmin ? getChatsForAdmin() : getChatsForCustomer(user?.id);

  useEffect(() => {
    if (!isAdmin && user && displayChats.length > 0 && !activeChat) {
      setActiveChat(displayChats[0]);
    }
  }, [user, displayChats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;

    sendMessage(activeChat.id, message, isAdmin ? 'admin' : 'user');
    setMessage('');
    
    if (!isAdmin) {
      setIsTyping(true);
      setTimeout(() => {
        sendMessage(activeChat.id, "Thanks for your message! I'll get back to you shortly.", 'admin');
        setIsTyping(false);
      }, 1500);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    setShowSidebar(false);
  };

  return (
    <div className="h-screen bg-slate-900 flex flex-col overflow-hidden">
      <nav className="bg-slate-800 border-b border-slate-700 shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">ECHO_AI</span>
            {isAdmin && <span className="hidden sm:inline px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs font-medium rounded">Admin</span>}
          </Link>
          <div className="flex items-center gap-2">
            {activeChat && (
              <button onClick={() => setShowSidebar(!showSidebar)} className="md:hidden p-2 text-slate-400">
                <Menu className="w-5 h-5" />
              </button>
            )}
            <Link to={isAdmin ? "/admin" : "/dashboard"} className="p-2 text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {isAdmin && showSidebar && (
          <div className="w-full md:w-80 bg-slate-800 border-r border-slate-700 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-700">
              <h2 className="font-semibold text-white">Conversations</h2>
              <p className="text-sm text-slate-400">{displayChats.length} active</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {displayChats.length === 0 ? (
                <div className="p-6 text-center text-slate-400">
                  <p>No conversations yet</p>
                </div>
              ) : (
                displayChats.map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => handleSelectChat(chat)}
                    className={`w-full p-4 text-left border-b border-slate-700/50 transition-colors ${
                      activeChat?.id === chat.id ? 'bg-indigo-500/20' : 'hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                        {chat.userName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-white truncate">{chat.userName}</span>
                          {chat.messages.length > 0 && (
                            <span className="text-xs text-slate-500 shrink-0 ml-2">{formatTime(chat.messages[chat.messages.length - 1].timestamp)}</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 truncate">{chat.lastMessage || 'No messages'}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          {activeChat ? (
            <>
              <div className="p-4 bg-slate-800 border-b border-slate-700 shrink-0">
                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <button onClick={() => setShowSidebar(false)} className="md:hidden p-1 text-slate-400">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                    {activeChat.userName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white truncate">{isAdmin ? activeChat.userName : 'ECHO_AI Team'}</h3>
                    <p className="text-sm text-slate-400 truncate">{activeChat.userEmail}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeChat.messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === (isAdmin ? 'admin' : 'user') ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] sm:max-w-[70%] p-3 sm:p-4 rounded-2xl ${
                      msg.sender === (isAdmin ? 'admin' : 'user')
                        ? 'bg-indigo-600 text-white rounded-br-sm'
                        : 'bg-slate-700 text-white rounded-bl-sm'
                    }`}>
                      <p className="leading-relaxed break-words">{msg.content}</p>
                      <p className="text-xs opacity-60 mt-2">{formatTime(msg.timestamp)}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 p-4 rounded-2xl rounded-bl-sm flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="p-4 bg-slate-800 border-t border-slate-700 shrink-0">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={isAdmin ? "Type a reply..." : "Type your message..."}
                    className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button type="submit" className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shrink-0">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Welcome to Chat</h3>
                <p className="text-slate-400 text-sm">
                  {isAdmin ? 'Select a conversation from the list' : 'Start a conversation with our team'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
