import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('echo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const adminEmail = localStorage.getItem('echo_admin_email') || 'admin@echoai.com';
    const adminPassword = localStorage.getItem('echo_admin_password') || 'admin123';

    if (email === adminEmail && password === adminPassword) {
      const adminUser = {
        id: 'admin',
        name: 'Admin',
        email: adminEmail,
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      setUser(adminUser);
      localStorage.setItem('echo_user', JSON.stringify(adminUser));
      return adminUser;
    }

    const users = JSON.parse(localStorage.getItem('echo_users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...safeUser } = foundUser;
      setUser(safeUser);
      localStorage.setItem('echo_user', JSON.stringify(safeUser));
      return safeUser;
    }
    return null;
  };

  const register = async (email, name, password) => {
    const users = JSON.parse(localStorage.getItem('echo_users') || '[]');
    
    if (users.find(u => u.email === email)) {
      return null;
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role: 'customer',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('echo_users', JSON.stringify(users));

    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem('echo_user', JSON.stringify(safeUser));
    return safeUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('echo_user');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
