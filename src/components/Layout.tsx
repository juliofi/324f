import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="logo">
          <h2>Controle de Estoque</h2>
        </div>
        <ul className="nav-menu">
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/insumos" className={isActive('/insumos') ? 'active' : ''}>
              Insumos
            </Link>
          </li>
          <li>
            <Link to="/fornecedores" className={isActive('/fornecedores') ? 'active' : ''}>
              Fornecedores
            </Link>
          </li>
          <li>
            <Link to="/contagem" className={isActive('/contagem') ? 'active' : ''}>
              Contagem
            </Link>
          </li>
          <li>
            <Link to="/compras" className={isActive('/compras') ? 'active' : ''}>
              Compras
            </Link>
          </li>
          <li>
            <Link to="/lista-compras" className={isActive('/lista-compras') ? 'active' : ''}>
              Lista de Compras
            </Link>
          </li>
          <li>
            <Link to="/cotacao" className={isActive('/cotacao') ? 'active' : ''}>
              Cotação
            </Link>
          </li>
        </ul>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

