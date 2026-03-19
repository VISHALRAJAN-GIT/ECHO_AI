import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Sparkles, Menu, X, ArrowLeft, Check, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const Chat = ({ isAdmin = false }) => {
  const { user } = useAuth();
  const { chats, activeChat, setActiveChat, startChat, sendMessage, getChatsForAdmin, getChatsForCustomer } = useApp();
  const [message, setMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);

  const displayChats = isAdmin ? getChatsForAdmin() : getChatsForCustomer(user?.id);

  useEffect(() => {
    if (!isAdmin && user && !activeChat) {
      const existingChat = getChatsForCustomer(user.id);
      if (existingChat.length > 0) {
        setActiveChat(existingChat[0]);
      } else if (user.role !== 'admin') {
        startChat(user.id, user.name, user.email);
      }
    }
  }, [user, displayChats, activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;

    sendMessage(activeChat.id, message, isAdmin ? 'admin' : 'user');
    setMessage('');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    setShowSidebar(false);
  };

  const handleStartChat = () => {
    if (!isAdmin && user) {
      startChat(user.id, user.name, user.email);
    }
  };

  return (
    <div className="h-screen bg-[#111a21] flex flex-col overflow-hidden">
      <nav className="bg-[#1f2c33] border-b border-[#333f47] shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">ECHO_AI</span>
            {isAdmin && <span className="hidden sm:inline px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded">Admin</span>}
          </Link>
          <div className="flex items-center gap-2">
            {activeChat && (
              <button onClick={() => setShowSidebar(!showSidebar)} className="md:hidden p-2 text-[#8696a1]">
                <Menu className="w-5 h-5" />
              </button>
            )}
            <Link to={isAdmin ? "/admin" : "/dashboard"} className="p-2 text-[#8696a1] hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {isAdmin && showSidebar && (
          <div className="w-full md:w-80 bg-[#111a21] border-r border-[#333f47] flex flex-col shrink-0">
            <div className="p-4 border-b border-[#333f47]">
              <h2 className="font-semibold text-white">Conversations</h2>
              <p className="text-sm text-[#8696a1]">{displayChats.length} active</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {displayChats.length === 0 ? (
                <div className="p-6 text-center text-[#8696a1]">
                  <p>No conversations yet</p>
                </div>
              ) : (
                displayChats.map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => handleSelectChat(chat)}
                    className={`w-full p-4 text-left border-b border-[#333f47]/50 transition-colors ${
                      activeChat?.id === chat.id ? 'bg-[#2a3942]' : 'hover:bg-[#1f2c33]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                        {chat.userName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-white truncate">{chat.userName}</span>
                          {chat.messages.length > 0 && (
                            <span className="text-xs text-[#8696a1] shrink-0 ml-2">{formatTime(chat.messages[chat.messages.length - 1].timestamp)}</span>
                          )}
                        </div>
                        <p className="text-sm text-[#8696a1] truncate">{chat.lastMessage || 'No messages'}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0 bg-[#0b141a]">
          {activeChat ? (
            <>
              <div className="p-3 bg-[#1f2c33] border-b border-[#333f47] shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isAdmin && (
                      <button onClick={() => setShowSidebar(false)} className="md:hidden p-1 text-[#8696a1]">
                        <X className="w-5 h-5" />
                      </button>
                    )}
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                      {isAdmin ? activeChat.userName?.charAt(0).toUpperCase() : 'E'}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white truncate flex items-center gap-2">
                        {isAdmin ? activeChat.userName : 'ECHO_AI Support'}
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      </h3>
                      <p className="text-sm text-[#8696a1] truncate">{isAdmin ? activeChat.userEmail : 'Online'}</p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {activeChat.messages.map((msg, i) => {
                  const isOwn = msg.sender === (isAdmin ? 'admin' : 'user');
                  const showDate = i === 0 || new Date(msg.timestamp).toDateString() !== new Date(activeChat.messages[i-1].timestamp).toDateString();
                  
                  return (
                    <div key={i}>
                      {showDate && (
                        <div className="flex justify-center mb-4">
                          <span className="text-xs text-[#8696a1] bg-[#1f2c33] px-3 py-1 rounded-full">
                            {formatDate(msg.timestamp)}
                          </span>
                        </div>
                      )}
                      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] p-3 rounded-2xl ${
                          isOwn 
                            ? 'bg-[#005c4b] text-white rounded-br-sm' 
                            : 'bg-[#1f2c33] text-white rounded-bl-sm'
                        }`}>
                          <p className="leading-relaxed break-words">{msg.content}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? 'text-[#abcffc]/70' : 'text-[#8696a1]'}`}>
                            <span className="text-xs">{formatTime(msg.timestamp)}</span>
                            {isOwn && (
                              <span className="text-xs">
                                <CheckCheck className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="p-3 bg-[#1f2c33] border-t border-[#333f47] shrink-0">
                <div className="flex items-center gap-2 bg-[#1f2c33] rounded-xl px-3 py-2">
                  <button type="button" className="p-2 text-[#8696a1] hover:text-white">
                    <span className="text-xl">📎</span>
                  </button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={isAdmin ? "Type a reply..." : "Type your message..."}
                    className="flex-1 px-3 py-2 bg-transparent border-none text-white placeholder-[#8696a1] focus:outline-none"
                  />
                  <button type="submit" className={`p-2 rounded-full transition-colors ${message.trim() ? 'bg-[#00a884] text-white' : 'text-[#8696a1]'}`}>
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#1f2c33] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10 text-[#00a884]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">WhatsApp-style Chat</h3>
                <p className="text-[#8696a1] text-sm mb-6">
                  {isAdmin ? 'Select a conversation from the list to start chatting' : 'Start a conversation with our support team'}
                </p>
                {!isAdmin && (
                  <button 
                    onClick={handleStartChat}
                    className="px-6 py-3 bg-[#00a884] hover:bg-[#008f6b] text-white font-semibold rounded-xl transition-colors"
                  >
                    Start New Chat
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;