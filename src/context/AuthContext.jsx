import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); 
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.get(`/users?email=${email}&password=${password}`);
      
      if (response.data.length === 0) {
        throw new Error('Credenciais inválidas');
      }
      
      const userData = response.data[0];
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      api.defaults.headers.common['X-Auth-User'] = JSON.stringify(userData);
      navigate('/');
      
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const checkUser = await api.get(`/users?email=${userData.email}`);
      if (checkUser.data.length > 0) {
        throw new Error('Email já cadastrado');
      }

      const response = await api.post('/users', {
        ...userData,
        balance: 0,
        transactions: [],
        id: Date.now() 
      });
      
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      navigate('/');
      
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    delete api.defaults.headers.common['X-Auth-User'];
    setUser(null);
    navigate('/login');
  };


  const deposit = async (amount) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');
      if (amount <= 0) throw new Error('Valor inválido');

      const response = await api.patch(`/users/${user.id}`, {
        balance: user.balance + amount,
        transactions: [
          ...user.transactions,
          {
            id: Date.now(),
            type: 'DEPOSITO',
            value: amount,
            date: new Date().toISOString(),
            description: 'Depósito realizado'
          }
        ]
      });

      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  const transfer = async (transferData) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');
      if (transferData.amount <= 0) throw new Error('Valor inválido');
      if (transferData.amount > user.balance) throw new Error('Saldo insuficiente');

      const userResponse = await api.patch(`/users/${user.id}`, {
        balance: user.balance - transferData.amount,
        transactions: [
          ...(user.transactions || []),
          {
            id: Date.now(),
            type: transferData.type,
            value: -transferData.amount,
            date: new Date().toISOString(),
            recipient: transferData.recipientName,
            description: `${transferData.type} para ${transferData.recipientName}`,
            ...(transferData.type === 'TED' && {
              bank: transferData.bank,
              agency: transferData.agency,
              account: transferData.account
            }),
            ...(transferData.type === 'PIX' && {
              pixKey: transferData.pixKey,
              pixType: transferData.pixType
            })
          }
        ]
      });

      if (transferData.recipientId) {
        const recipient = await api.get(`/users/${transferData.recipientId}`);
        const recipientTransactions = recipient.data.transactions || [];

        await api.patch(`/users/${transferData.recipientId}`, {
          balance: (recipient.data.balance || 0) + transferData.amount,
          transactions: [
            ...recipientTransactions,
            {
              id: Date.now(),
              type: 'RECEBIDO',
              value: transferData.amount,
              date: new Date().toISOString(),
              sender: user.name,
              description: `${transferData.type} recebido de ${user.name}`
            }
          ]
        });
      }

      // Atualiza o usuário no contexto
      const updatedUser = userResponse.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      login, 
      register, 
      logout,
      deposit,
      transfer
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);