import { useAuth } from '../context/AuthContext';
import BalanceCard from '../components/ui/BalanceCard';
import TransactionHistory from '../components/transactions/TransactionHistory';
import Headers from '../components/ui/Header';
import { useState } from 'react';

const Home = () => {
  const { user } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="flex">
      <Headers
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
      />

      <div
        className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'ml-48' : 'ml-16'
          } p-6`}
      >
        <h1 className="text-2xl font-bold mb-6">Olá, {user?.name}</h1>

        <BalanceCard balance={user?.balance} />

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Últimas Transações</h2>
          <TransactionHistory transactions={user?.transactions} />
        </div>
      </div>
    </div>
  );
};

export default Home;
