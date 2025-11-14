import { useApp } from '../context/AppContext';
import { formatarPeriodoSemana } from '../utils/semanas';
import './Dashboard.css';

export function Dashboard() {
  const { semanas, semanaAtual } = useApp();
  const semana = semanas.find(s => s.id === semanaAtual);

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>
          Dashboard {semanaAtual && semana && (
            <span className="semana-info-header">({formatarPeriodoSemana(semana)})</span>
          )}
        </h1>
      </div>

      <div className="dashboard-content">
        {semanaAtual && semana ? (
          <div className="semana-info">
            <h2>Semana Selecionada</h2>
            <p>{formatarPeriodoSemana(semana)}</p>
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>Estoque Inicial</h3>
                <p className="stat-value">{semana.estoqueInicial.length} itens</p>
              </div>
              <div className="stat-card">
                <h3>Compras</h3>
                <p className="stat-value">{semana.compras.length} itens</p>
              </div>
              <div className="stat-card">
                <h3>Estoque Final</h3>
                <p className="stat-value">{semana.estoqueFinal.length} itens</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="semana-alert">
            <p>Selecione uma semana na sidebar para visualizar o dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
}
