import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaTimes } from 'react-icons/fa';

const DepositModal = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [depositType, setDepositType] = useState('pix');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const { deposit } = useAuth();

  useEffect(() => {
    const numericAmount = parseFloat(amount) / 100; 
    if (!numericAmount || numericAmount <= 0) {
      setGeneratedCode('');
      return;
    }

    const code = depositType === 'pix'
      ? `00020126580014BR.GOV.BCB.PIX0136pix@seudominio.com.br520400005303986540${numericAmount.toFixed(2).replace('.', '')}5802BR5920Seu Nome Completo6009SaoPaulo62100506ABC1236304ABCD`
      : `23793381286009827391000001234567890123456000${String(numericAmount.toFixed(2)).padStart(10, '0')}`;

    setGeneratedCode(code);
  }, [depositType, amount]);

  const formatCurrency = (value) => {
    const numeric = Number(value || 0) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numeric);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const numericAmount = parseFloat(amount) / 100;
      if (isNaN(numericAmount)) throw new Error('Valor inválido');

      await deposit(numericAmount, depositType);
    } catch (err) {
      setError(err.message || 'Erro ao realizar depósito');
    } finally {
      setIsLoading(false);
      onClose();
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
                value={formatCurrency(amount)}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  setAmount(raw); 
                }}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Depósito
            </label>
            <select
              value={depositType}
              onChange={(e) => setDepositType(e.target.value)}
              className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pix">PIX</option>
              <option value="boleto">Boleto</option>
            </select>
          </div>

          {generatedCode && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {depositType === 'pix' ? 'PIX Copia e Cola' : 'Código de Barras'}
              </label>
              <textarea
                className="w-full bg-gray-100 p-3 mt-1 border border-blue-100 hover:border-blue-100 focus:border-blue-100 focus:outline-none transition rounded-md text-sm"
                readOnly
                value={generatedCode}
              />
            </div>
          )}

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
              className={`px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 ${isLoading || !amount ? 'opacity-70 cursor-not-allowed' : ''
                }`}
            >
              {isLoading ? 'Processando...' : 'Confirmar Depósito'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepositModal;