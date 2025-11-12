import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Dashboard.css';

export function Dashboard() {
  const { semanas, insumos } = useApp();
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [faturamento, setFaturamento] = useState('');

  const semanasFiltradas = semanas.filter(semana => {
    if (!dataInicio || !dataFim) return false;
    return semana.dataInicio >= dataInicio && semana.dataFim <= dataFim;
  });

  const cmvGlobal = semanasFiltradas.reduce((total, semana) => {
    const cmvSemana = semana.cmv.reduce((sum, item) => sum + item.precoTotal, 0);
    return total + cmvSemana;
  }, 0);

  const valorEmEstoque = semanasFiltradas.length > 0 
    ? semanasFiltradas[semanasFiltradas.length - 1].estoqueFinal.reduce(
        (sum, item) => sum + item.precoTotal, 0
      )
    : 0;

  const cmvPercentual = faturamento && parseFloat(faturamento) > 0
    ? ((cmvGlobal / parseFloat(faturamento)) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="dashboard-filters">
        <div className="filter-group">
          <label>Data Início:</label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Data Fim:</label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Faturamento (R$):</label>
          <input
            type="number"
            step="0.01"
            value={faturamento}
            onChange={(e) => setFaturamento(e.target.value)}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="dashboard-cards">
        <div className="card">
          <h3>CMV Global</h3>
          <p className="value">R$ {cmvGlobal.toFixed(2)}</p>
        </div>
        
        <div className="card">
          <h3>CMV em %</h3>
          <p className="value">{cmvPercentual}%</p>
        </div>
        
        <div className="card">
          <h3>Valor em Estoque</h3>
          <p className="value">R$ {valorEmEstoque.toFixed(2)}</p>
        </div>
      </div>

      <div className="dashboard-info">
        <p>Total de Insumos Cadastrados: <strong>{insumos.length}</strong></p>
        <p>Semanas no Período: <strong>{semanasFiltradas.length}</strong></p>
      </div>
    </div>
  );
}

