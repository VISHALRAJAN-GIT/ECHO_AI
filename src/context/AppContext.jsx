import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const defaultPortfolio = [
  {
    id: '1',
    title: 'AI Chatbot Platform',
    description: 'Custom chatbot solution for e-commerce',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
    category: 'AI Development',
    completedDate: '2024-12-15'
  },
  {
    id: '2',
    title: 'E-commerce Dashboard',
    description: 'Analytics dashboard with real-time data',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    category: 'Web Development',
    completedDate: '2024-11-20'
  },
  {
    id: '3',
    title: 'Mobile Banking App',
    description: 'Secure mobile banking application',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
    category: 'Mobile Development',
    completedDate: '2024-10-05'
  }
];

const defaultAchievements = [
  { id: '1', label: 'Projects Completed', value: 0, icon: '📁' },
  { id: '2', label: 'Happy Clients', value: 0, icon: '😊' },
  { id: '3', label: 'Years Experience', value: 0, icon: '⏱️' },
  { id: '4', label: 'Awards Won', value: 0, icon: '🏆' },
];

export const AppProvider = ({ children }) => {
  const [companyData, setCompanyData] = useState(() => {
    const stored = localStorage.getItem('echo_company_data');
    if (stored) return JSON.parse(stored);
    return {
      name: 'ECHO_AI',
      tagline: 'AI-Powered Solutions',
      description: 'We deliver cutting-edge AI solutions for your business',
      email: 'contact@echoai.com',
      phone: '+1 234 567 8900',
      address: 'Your Address Here',
      achievements: defaultAchievements,
      portfolio: defaultPortfolio,
      services: ['AI Development', 'Web Development', 'Mobile Apps', 'Cloud Solutions'],
      socialLinks: {
        linkedin: '',
        twitter: '',
        github: ''
      }
    };
  });

  const [chats, setChats] = useState(() => {
    const stored = localStorage.getItem('echo_chats');
    return stored ? JSON.parse(stored) : [];
  });

  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    localStorage.setItem('echo_company_data', JSON.stringify(companyData));
  }, [companyData]);

  useEffect(() => {
    localStorage.setItem('echo_chats', JSON.stringify(chats));
  }, [chats]);

  const updateCompanyData = (newData) => {
    setCompanyData(prev => ({ ...prev, ...newData }));
  };

  const updateAchievement = (id, value) => {
    setCompanyData(prev => ({
      ...prev,
      achievements: prev.achievements.map(a => 
        a.id === id ? { ...a, value: parseInt(value) || 0 } : a
      )
    }));
  };

  const addPortfolioItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      completedDate: new Date().toISOString().split('T')[0]
    };
    setCompanyData(prev => ({
      ...prev,
      portfolio: [newItem, ...prev.portfolio]
    }));
  };

  const deletePortfolioItem = (id) => {
    setCompanyData(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter(p => p.id !== id)
    }));
  };

  const startChat = (userId, userName, userEmail, isAdmin = false) => {
    const existingChat = chats.find(c => c.userId === userId);
    if (existingChat) {
      setActiveChat(existingChat);
      return existingChat;
    }

    const newChat = {
      id: Date.now().toString(),
      userId,
      userName,
      userEmail,
      isAdmin,
      messages: [],
      createdAt: new Date().toISOString(),
      lastMessage: null
    };
    setChats(prev => [...prev, newChat]);
    setActiveChat(newChat);
    return newChat;
  };

  const sendMessage = (chatId, message, sender = 'user') => {
    const newMessage = {
      id: Date.now().toString(),
      content: message,
      sender,
      timestamp: new Date().toISOString()
    };

    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: message
        };
      }
      return chat;
    }));

    setActiveChat(prev => {
      if (prev && prev.id === chatId) {
        return {
          ...prev,
          messages: [...prev.messages, newMessage],
          lastMessage: message
        };
      }
      return prev;
    });

    return newMessage;
  };

  const getChatsForAdmin = () => chats;
  const getChatsForCustomer = (userId) => chats.filter(c => c.userId === userId || c.userId === 'admin');

  const value = {
    companyData,
    updateCompanyData,
    updateAchievement,
    addPortfolioItem,
    deletePortfolioItem,
    chats,
    activeChat,
    setActiveChat,
    startChat,
    sendMessage,
    getChatsForAdmin,
    getChatsForCustomer
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
