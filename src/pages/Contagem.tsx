import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { EstoqueInicial, EstoqueFinal, Semana } from '../types';
import './Contagem.css';

export function Contagem() {
  const { insumos, semanas, semanaAtual, getSemanaAtual, addSemana, updateSemana, setSemanaAtual } = useApp();
  const [tipoContagem, setTipoContagem] = useState<'inicial' | 'final'>('inicial');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const semana = getSemanaAtual();

  useEffect(() => {
    if (!semanaAtual && semanas.length > 0) {
      setSemanaAtual(semanas[semanas.length - 1].id);
    }
  }, [semanaAtual, semanas, setSemanaAtual]);

  const handleNovaSemana = () => {
    if (!dataInicio || !dataFim) {
      alert('Preencha as datas da semana');
      return;
    }

    const novaSemana: Semana = {
      id: Date.now().toString(),
      dataInicio,
      dataFim,
      estoqueInicial: [],
      compras: [],
      estoqueFinal: [],
      cmv: [],
    };

    addSemana(novaSemana);
    setSemanaAtual(novaSemana.id);
    setDataInicio('');
    setDataFim('');
  };

  const handleDuplicarSemanaAnterior = () => {
    if (semanas.length === 0) {
      alert('Não há semana anterior para duplicar');
      return;
    }

    const semanaAnterior = semanas[semanas.length - 1];
    const novaSemana: Semana = {
      id: Date.now().toString(),
      dataInicio: dataInicio || new Date().toISOString().split('T')[0],
      dataFim: dataFim || new Date().toISOString().split('T')[0],
      estoqueInicial: semanaAnterior.estoqueFinal.map(ef => ({
        ...ef,
        semana: Date.now().toString(),
      })),
      compras: [],
      estoqueFinal: [],
      cmv: [],
    };

    addSemana(novaSemana);
    setSemanaAtual(novaSemana.id);
    setDataInicio('');
    setDataFim('');
  };

  const updateItem = (insumoId: string, quantidade: number, precoUnitario: number) => {
    if (!semana) return;

    if (tipoContagem === 'inicial') {
      const precoTotal = quantidade * precoUnitario;
      const item = { insumoId, quantidade, precoUnitario, precoTotal, semana: semana.id };
      
      const estoqueInicial = [...semana.estoqueInicial];
      const index = estoqueInicial.findIndex(ei => ei.insumoId === insumoId);
      
      if (index >= 0) {
        estoqueInicial[index] = item as EstoqueInicial;
      } else {
        estoqueInicial.push(item as EstoqueInicial);
      }
      
      updateSemana(semana.id, { estoqueInicial });
    } else {
      // Para Estoque Final, o preço unitário deve ser igual ao da compra (C)
      const compra = semana.compras.find(c => c.insumoId === insumoId);
      const precoFinal = compra?.precoUnitario || precoUnitario;
      const precoTotal = quantidade * precoFinal;
      const item = { insumoId, quantidade, precoUnitario: precoFinal, precoTotal, semana: semana.id };
      
      const estoqueFinal = [...semana.estoqueFinal];
      const index = estoqueFinal.findIndex(ef => ef.insumoId === insumoId);
      
      if (index >= 0) {
        estoqueFinal[index] = item as EstoqueFinal;
      } else {
        estoqueFinal.push(item as EstoqueFinal);
      }
      
      updateSemana(semana.id, { estoqueFinal });
    }
  };

  const getItemValue = (insumoId: string) => {
    if (!semana) return { quantidade: 0, precoUnitario: 0 };
    
    if (tipoContagem === 'inicial') {
      const item = semana.estoqueInicial.find(ei => ei.insumoId === insumoId);
      return item || { quantidade: 0, precoUnitario: 0 };
    } else {
      // Para Estoque Final, o preço unitário deve ser igual ao da compra (C)
      const compra = semana.compras.find(c => c.insumoId === insumoId);
      const item = semana.estoqueFinal.find(ef => ef.insumoId === insumoId);
      
      // Se houver compra, usa o preço da compra; senão, usa o preço do EF se existir
      const precoUnitario = compra?.precoUnitario || item?.precoUnitario || 0;
      const quantidade = item?.quantidade || 0;
      
      return { quantidade, precoUnitario };
    }
  };

  return (
    <div className="contagem">
      <h1>Contagem de Estoque</h1>

      <div className="contagem-controls">
        <div className="control-group">
          <label>Tipo de Contagem:</label>
          <select value={tipoContagem} onChange={(e) => setTipoContagem(e.target.value as 'inicial' | 'final')}>
            <option value="inicial">Estoque Inicial (EI)</option>
            <option value="final">Estoque Final (EF)</option>
          </select>
        </div>

        <div className="control-group">
          <label>Semana Atual:</label>
          <select 
            value={semanaAtual || ''} 
            onChange={(e) => setSemanaAtual(e.target.value)}
          >
            {semanas.map(s => (
              <option key={s.id} value={s.id}>
                {s.dataInicio} a {s.dataFim}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="nova-semana">
        <h3>Nova Semana</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Data Início:</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Data Fim:</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>
          <button onClick={handleNovaSemana} className="btn-primary">
            Criar Nova Semana
          </button>
          <button onClick={handleDuplicarSemanaAnterior} className="btn-secondary">
            Duplicar Semana Anterior
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Insumo</th>
              <th>Quantidade</th>
              <th>Preço Unitário (R$)</th>
              <th>Preço Total (R$)</th>
            </tr>
          </thead>
          <tbody>
            {insumos.map(insumo => {
              const item = getItemValue(insumo.id);
              return (
                <tr key={insumo.id}>
                  <td>{insumo.nome} ({insumo.unidadeMedida})</td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      value={item.quantidade}
                      onChange={(e) => {
                        const qtd = parseFloat(e.target.value) || 0;
                        updateItem(insumo.id, qtd, item.precoUnitario);
                      }}
                      className="input-number"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      value={item.precoUnitario}
                      onChange={(e) => {
                        const preco = parseFloat(e.target.value) || 0;
                        updateItem(insumo.id, item.quantidade, preco);
                      }}
                      className="input-number"
                      disabled={tipoContagem === 'final' && !!semana?.compras.some(c => c.insumoId === insumo.id)}
                      title={tipoContagem === 'final' && semana?.compras.some(c => c.insumoId === insumo.id) ? 'Preço definido pela compra' : ''}
                    />
                  </td>
                  <td>{(item.quantidade * item.precoUnitario).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

