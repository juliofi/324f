import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatarPeriodoSemana } from '../utils/semanas';
import './Layout.css';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { semanas, semanaAtual, setSemanaAtual } = useApp();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const handleSemanaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSemanaAtual(e.target.value || null);
  };

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="logo">
          <h2>Controle de Estoque</h2>
        </div>
        <div className="semana-selector-sidebar">
          <label htmlFor="semana-select-sidebar">Semana:</label>
          <select
            id="semana-select-sidebar"
            value={semanaAtual || ''}
            onChange={handleSemanaChange}
            className="select-semana-sidebar"
          >
            <option value="">Selecione uma semana</option>
            {semanas.map((semana) => (
              <option key={semana.id} value={semana.id}>
                {formatarPeriodoSemana(semana)}
              </option>
            ))}
          </select>
        </div>
        <ul className="nav-menu">
          <li>
            <Link to="/estoque" className={isActive('/estoque') ? 'active' : ''}>
              Estoque Inicial
            </Link>
          </li>
          <li>
            <Link to="/compras" className={isActive('/compras') ? 'active' : ''}>
              Compras
            </Link>
          </li>
          <li>
            <Link to="/estoque-final" className={isActive('/estoque-final') ? 'active' : ''}>
              Estoque Final
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/insumos" className={isActive('/insumos') ? 'active' : ''}>
              Itens
            </Link>
          </li>
          <li>
            <Link to="/fornecedores" className={isActive('/fornecedores') ? 'active' : ''}>
              Fornecedores
            </Link>
          </li>
        </ul>
        <div className="logout-section">
          <button onClick={handleLogout} className="btn-logout">
            Sair
          </button>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

