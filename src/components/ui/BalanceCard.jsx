import { useEffect, useState } from 'react';
import { FaWallet, FaMoneyBillWave, FaExchangeAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import DepositModal from './DepositModal';
import TransferModal from './TransferModal';
import { useAuth } from '../../context/AuthContext';

const BalanceCard = ({ balance }) => {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [isBlurred, setIsBlurred] = useState(true);
  const { user , allUsers } = useAuth();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await allUsers();
        setUsers(data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <FaWallet className="text-blue-600 text-xl" />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Saldo Disponível</h3>
            <div className="flex items-center space-x-2">
              <p
                className={`text-2xl font-bold text-gray-800 transition duration-200 ${isBlurred ? 'blur-sm select-none' : ''
                  }`}
              >
                {balance?.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </p>
              <button onClick={() => setIsBlurred(!isBlurred)} className="text-gray-500 hover:text-gray-800">
                {isBlurred ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowDepositModal(true)}
            className="w-full md:w-auto px-3 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 transition flex items-center justify-center space-x-2"
          >
            <FaMoneyBillWave className="text-green-500 text-xl" />
            <span>Depositar</span>
          </button>
          <button
            onClick={() => setShowTransferModal(true)}
            className="w-full md:w-auto px-3 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 transition flex items-center justify-center space-x-2"
          >
            <FaExchangeAlt className="text-white text-xl" />
            <span>Transferir</span>
          </button>
        </div>

        {showDepositModal && (
          <DepositModal onClose={() => setShowDepositModal(false)} />
        )}

        {showTransferModal && (
          <TransferModal onClose={() => setShowTransferModal(false)} users={users} />
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex flex-col md:flex-row justify-between text-sm text-gray-500">
          <span>Conta Corrente</span>
          <span>Agência {user?.agency} • Conta {user.account}</span>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
