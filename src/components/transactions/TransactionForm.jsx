import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/transactions';

const TransactionForm = ({ type, currentBalance }) => {
  const [formData, setFormData] = useState({
    recipient: '',
    value: '',
    transactionPassword: '',
    ...(type === 'TED' && {
      bank: '',
      agency: '',
      account: ''
    }),
    ...(type === 'PIX' && {
      pixKey: ''
    })
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, logout } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await api.post('/transactions', {
        ...formData,
        type,
        userId: user.id
      });
      
      setSuccess('Transação realizada com sucesso!');
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      } else {
        setError(err.response?.data?.message || 'Erro ao realizar transação');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      
      <div className="mb-4">
        <label className="block mb-2">Nome do Favorecido</label>
        <input
          type="text"
          name="recipient"
          value={formData.recipient}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      {type === 'TED' && (
        <>
          <div className="mb-4">
            <label className="block mb-2">Banco</label>
            <input
              type="text"
              name="bank"
              value={formData.bank}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Agência</label>
            <input
              type="text"
              name="agency"
              value={formData.agency}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Conta</label>
            <input
              type="text"
              name="account"
              value={formData.account}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </>
      )}
      
      {type === 'PIX' && (
        <div className="mb-4">
          <label className="block mb-2">Chave PIX</label>
          <input
            type="text"
            name="pixKey"
            value={formData.pixKey}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      )}
      
      <div className="mb-4">
        <label className="block mb-2">Valor</label>
        <input
          type="number"
          name="value"
          value={formData.value}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="0.01"
          step="0.01"
          max={currentBalance}
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">Senha de Transação</label>
        <input
          type="password"
          name="transactionPassword"
          value={formData.transactionPassword}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Confirmar Transferência
      </button>
    </form>
  );
};

export default TransactionForm;