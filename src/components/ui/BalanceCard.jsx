import { useState } from 'react';
import { FaWallet } from 'react-icons/fa';
import DepositModal from './DepositModal';
import TransferModal from './TransferModal';

const BalanceCard = ({ balance }) => {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <FaWallet className="text-blue-600 text-xl" />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Saldo Disponível</h3>
            <p className="text-2xl font-bold text-gray-800">
              {balance?.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowDepositModal(true)}
            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 transition"
          >
            Depositar
          </button>
          <button 
            onClick={() => setShowTransferModal(true)}
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
          >
            Transferir
          </button>
        </div>

        {showDepositModal && (
        <DepositModal onClose={() => setShowDepositModal(false)} />
      )}

      {showTransferModal && (
        <TransferModal onClose={() => setShowTransferModal(false)} />
      )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Conta Corrente</span>
          <span>Agência 0001 • Conta 12345-6</span>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;