import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Insumos } from './pages/Insumos';
import { Fornecedores } from './pages/Fornecedores';
import { Contagem } from './pages/Contagem';
import { Compras } from './pages/Compras';
import { ListaCompras } from './pages/ListaCompras';
import { Cotacao } from './pages/Cotacao';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/insumos" element={<Insumos />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
          <Route path="/contagem" element={<Contagem />} />
          <Route path="/compras" element={<Compras />} />
          <Route path="/lista-compras" element={<ListaCompras />} />
          <Route path="/cotacao" element={<Cotacao />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
