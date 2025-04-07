import { FaArrowDown, FaArrowUp, FaMoneyBillWave } from 'react-icons/fa';
import { FiPieChart } from 'react-icons/fi';

const TransactionHistory = ({ transactions = [] }) => {
  const getTransactionIcon = (type, value) => {
    const isNegative = value < 0;
    
    switch(type) {
      case 'PIX':
        return {
          icon: <FiPieChart className="text-purple-500" />,
          bgColor: 'bg-purple-100'
        };
      case 'TED':
        return {
          icon: isNegative 
            ? <FaArrowUp className="text-red-500 rotate-45" /> 
            : <FaArrowDown className="text-green-500 -rotate-45" />,
          bgColor: isNegative ? 'bg-red-100' : 'bg-green-100'
        };
      default:
        return {
          icon: <FaMoneyBillWave className="text-blue-500" />,
          bgColor: 'bg-blue-100'
        };
    }
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">Histórico de Transações</h3>
      </div>
      
      {transactions.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          Nenhuma transação encontrada
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {transactions.map((transaction) => {
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
                        {transaction.type} - {transaction.recipient}
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
                      currency: 'BRL'
                    })}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TransactionHistory;