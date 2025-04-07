import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';
import { BrowserRouter } from 'react-router-dom';
import '../src/styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;