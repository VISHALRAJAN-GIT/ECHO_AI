import { useState, useRef, useEffect } from 'react';
import { Search, Send, MoreVertical, AlertTriangle, Phone, Mail, Plus, X, MessageSquare, Bot, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Conversations = () => {
  const { customers, conversations, activeConversation, setActiveConversation, sendMessage } = useApp();
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (customers.length > 0 && conversations.length === 0) {
      const initialConversations = customers.slice(0, 5).map(customer => ({
        id: customer.id,
        customer_id: customer.id,
        customer: customer,
        messages: [
          {
            id: 1,
            content: "Hello! I need some help with my account.",
            sender: 'customer',
            created_at: new Date(Date.now() - 3600000).toISOString(),
          }
        ],
        is_active: true,
      }));
      setActiveConversation(initialConversations[0]);
    }
  }, [customers, conversations.length, setActiveConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, activeConversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeConversation) return;

    setIsTyping(true);
    await sendMessage(activeConversation.customer_id, message);
    setMessage('');
    setTimeout(() => setIsTyping(false), 1000);
  };

  const filteredConversations = conversations.filter(conv => 
    conv.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-8 h-[calc(100vh-64px)] flex flex-col max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Conversations</h1>
          <p className="text-slate-400 mt-1">Chat with customers in real-time</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Agent Active
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[380px_1fr] gap-6 min-h-0">
        <div className="card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-700/50">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-12"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-400 mb-1">No conversations yet</p>
                <p className="text-xs text-slate-500">Create a ticket to start chatting</p>
              </div>
            ) : (
              filteredConversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={`p-4 border-b border-slate-700/50 cursor-pointer transition-all ${
                    activeConversation?.id === conv.id 
                      ? 'bg-indigo-500/10 border-l-4 border-l-indigo-500' 
                      : 'hover:bg-slate-700/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center font-bold text-white">
                        {conv.customer?.name?.charAt(0).toUpperCase() || 'C'}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-800 ${
                        conv.is_active ? 'bg-emerald-500' : 'bg-slate-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-white">{conv.customer?.name || 'Customer'}</span>
                        <span className="text-xs text-slate-500">
                          {conv.messages?.length > 0 ? formatDate(conv.messages[conv.messages.length - 1].created_at) : ''}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 truncate">
                        {conv.messages?.length > 0 ? conv.messages[conv.messages.length - 1].content : 'No messages'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card flex flex-col overflow-hidden">
          {activeConversation ? (
            <>
              <div className="p-4 border-b border-slate-700/50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center font-bold text-white">
                    {activeConversation.customer?.name?.charAt(0).toUpperCase() || 'C'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{activeConversation.customer?.name || 'Customer'}</h3>
                    <p className="text-xs text-slate-400">{activeConversation.customer?.email || 'No email'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-slate-700 rounded-xl transition-colors" title="Call">
                    <Phone className="w-5 h-5 text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-700 rounded-xl transition-colors" title="Email">
                    <Mail className="w-5 h-5 text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-700 rounded-xl transition-colors" title="More">
                    <MoreVertical className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {activeConversation.messages?.map((msg, index) => (
                  <div 
                    key={msg.id || index}
                    className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div 
                      className={`max-w-[70%] p-4 rounded-2xl ${
                        msg.sender === 'customer' 
                          ? 'bg-slate-700/80 text-white rounded-bl-sm' 
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-sm'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs opacity-70 mb-2">
                        {msg.sender === 'ai' && <Bot className="w-3 h-3" />}
                        <span>{msg.sender === 'customer' ? (activeConversation.customer?.name || 'Customer') : 'AI Agent'}</span>
                        <span>·</span>
                        <span>{formatTime(msg.created_at)}</span>
                      </div>
                      <p className="leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700/80 p-4 rounded-2xl rounded-bl-sm flex items-center gap-2">
                      <Bot className="w-4 h-4 text-indigo-400" />
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

              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700/50">
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="input flex-1"
                  />
                  <button type="submit" className="btn-primary px-6 flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                  <Sparkles className="w-3 h-3" />
                  <span>AI will suggest responses based on context</span>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-10 h-10 text-slate-400" />
                </div>
                <p className="text-slate-400 mb-2">No conversation selected</p>
                <p className="text-sm text-slate-500">Select a conversation from the list to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversations;
