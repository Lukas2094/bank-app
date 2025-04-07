import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';
import { BrowserRouter } from 'react-router-dom';


function App() {


   useEffect(() => {
    document.body.classList.add('bg-blue-100', 'text-gray-900');
    return () => {
      document.body.classList.remove('bg-blue-100', 'text-gray-900');
    };
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
          <AppRoutes />  
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;