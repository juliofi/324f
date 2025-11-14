import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Estoque } from './pages/Estoque';
import { EstoqueFinal } from './pages/EstoqueFinal';
import { Dashboard } from './pages/Dashboard';
import { Insumos } from './pages/Insumos';
import { Fornecedores } from './pages/Fornecedores';
import { Compras } from './pages/Compras';

// Componente para proteger rotas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/estoque" replace /> : <Login />} 
        />
        <Route
          path="/estoque"
          element={
            <ProtectedRoute>
              <Layout>
                <Estoque />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/insumos"
          element={
            <ProtectedRoute>
              <Layout>
                <Insumos />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/fornecedores"
          element={
            <ProtectedRoute>
              <Layout>
                <Fornecedores />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/compras"
          element={
            <ProtectedRoute>
              <Layout>
                <Compras />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/estoque-final"
          element={
            <ProtectedRoute>
              <Layout>
                <EstoqueFinal />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
