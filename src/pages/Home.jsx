import { useAuth } from '../context/AuthContext';
import BalanceCard from '../components/ui/BalanceCard'; // Verifique esta importação
import TransactionHistory from '../components/transactions/TransactionHistory'; // E esta

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Olá, {user?.name}</h1>
      
      <BalanceCard balance={user?.balance} />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Últimas Transações</h2>
        <TransactionHistory transactions={user?.transactions} />
      </div>
    </div>
  );
};

export default Home;