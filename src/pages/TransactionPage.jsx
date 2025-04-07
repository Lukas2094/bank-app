import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TransactionForm from '../components/transactions/TransactionForm';
import { FaExchangeAlt } from 'react-icons/fa';
import { FaPix } from "react-icons/fa6";

const TransactionPage = () => {
  const [transactionType, setTransactionType] = useState('PIX');
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Nova Transação</h1>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTransactionType('PIX')}
          className={`flex items-center gap-2 px-4 py-2 rounded ${transactionType === 'PIX' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          <FaPix /> PIX
        </button>
        <button
          onClick={() => setTransactionType('TED')}
          className={`flex items-center gap-2 px-4 py-2 rounded ${transactionType === 'TED' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          <FaExchangeAlt /> TED
        </button>
      </div>
      
      <TransactionForm 
        type={transactionType} 
        currentBalance={user?.balance} 
      />
    </div>
  );
};

export default TransactionPage;