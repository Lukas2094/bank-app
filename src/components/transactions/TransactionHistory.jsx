import { useState } from 'react';
import { FaArrowDown, FaArrowUp, FaMoneyBillWave } from 'react-icons/fa';
import { FiPieChart } from 'react-icons/fi';

const ITEMS_PER_PAGE = 5;

const TransactionHistory = ({ transactions = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('TODOS');

  const handleFilter = (type) => {
    setFilter(type);
    setCurrentPage(1);
  };

  const getTransactionIcon = (type, value) => {
    const isNegative = value < 0;

    switch (type) {
      case 'PIX':
        return {
          icon: <FiPieChart className="text-purple-500" />,
          bgColor: 'bg-purple-100',
        };
      case 'TED':
        return {
          icon: isNegative
            ? <FaArrowUp className="text-red-500 rotate-45" />
            : <FaArrowDown className="text-green-500 -rotate-45" />,
          bgColor: isNegative ? 'bg-red-100' : 'bg-green-100',
        };
      default:
        return {
          icon: <FaMoneyBillWave className="text-blue-500" />,
          bgColor: 'bg-blue-100',
        };
    }
  };

  const formatDate = (dateString) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'TODOS') return true;
    if (filter === 'PIX') return transaction.type === 'PIX';
    if (filter === 'TED') return transaction.type === 'TED';
    if (filter === 'ENTRADAS') return transaction.value > 0;
    if (filter === 'SAIDAS') return transaction.value < 0;
    return true;
  });

  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalPages = Math.ceil(sortedTransactions.length / ITEMS_PER_PAGE);

  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Histórico de Transações</h3>
        <div className="space-x-2 overflow-x-scroll flex flex-nowrap p-5">
          {['TODOS', 'PIX', 'TED', 'ENTRADAS', 'SAIDAS'].map((type) => (
            <button
              key={type}
              className={`text-xs px-2 py-1 rounded 
                ${filter === type ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
              `}
              onClick={() => handleFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          Nenhuma transação encontrada
        </div>
      ) : (
        <div className="max-h-80 overflow-y-auto custom-scrollbar">
          <ul className="divide-y divide-gray-100">
            {paginatedTransactions.map((transaction) => {
              const { icon, bgColor } = getTransactionIcon(transaction.type, transaction.value);
              const isNegative = transaction.value < 0;
              const absValue = Math.abs(transaction.value);
  
              return (
                <li key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${bgColor}`}>
                        {icon}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {transaction.type} {transaction.recipient && `- ${transaction.recipient}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>

                    <div className={`font-medium ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
                      {isNegative ? '-' : '+'}
                      {absValue.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center p-4 space-x-2">
          <button
            className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span className="text-sm text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <button
            className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
