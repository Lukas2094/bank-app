import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaTimes } from 'react-icons/fa';

const DepositModal = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { deposit } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount)) throw new Error('Valor inválido');
      
      await deposit(numericAmount);
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao realizar depósito');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Depositar</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">R$</span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={new Intl.NumberFormat('pt-BR').format(Number(amount || 0))}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '')
                  setAmount(raw)
                }}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="0,00"
              />

            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !amount}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 ${
                isLoading || !amount ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Depositando...' : 'Confirmar Depósito'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepositModal;