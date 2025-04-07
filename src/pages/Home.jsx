import { useAuth } from '../context/AuthContext';
import BalanceCard from '../components/ui/BalanceCard';
import TransactionHistory from '../components/transactions/TransactionHistory';
import Headers from '../components/ui/Header';
import { useState, useEffect } from 'react';

const Home = () => {
  const { user } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 968);
    checkMobile();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex flex-col md:flex-row">
      <Headers
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
      />

      <div
        className={`flex-1 transition-all duration-300 
          ${!isMobile ? (isSidebarExpanded ? 'ml-48' : 'ml-16') : ''} 
          ${isMobile ? 'mt-16' : ''} 
          p-6`}
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
