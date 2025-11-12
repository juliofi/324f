import { useApp } from '../context/AppContext';
import type { Compra } from '../types';
import './Compras.css';

export function Compras() {
  const { insumos, fornecedores, getSemanaAtual, updateSemana } = useApp();
  const semana = getSemanaAtual();

  const updateItem = (insumoId: string, quantidade: number, precoUnitario: number, fornecedorId?: string) => {
    if (!semana) return;

    const precoTotal = quantidade * precoUnitario;
    const item: Compra = { 
      insumoId, 
      quantidade, 
      precoUnitario, 
      precoTotal, 
      semana: semana.id,
      fornecedorId 
    };

    const compras = [...semana.compras];
    const index = compras.findIndex(c => c.insumoId === insumoId);
    
    if (index >= 0) {
      compras[index] = item;
    } else {
      compras.push(item);
    }
    
    updateSemana(semana.id, { compras });
  };

  const getItemValue = (insumoId: string) => {
    if (!semana) return { quantidade: 0, precoUnitario: 0, fornecedorId: '' };
    
    const item = semana.compras.find(c => c.insumoId === insumoId);
    return item || { quantidade: 0, precoUnitario: 0, fornecedorId: '' };
  };

  if (!semana) {
    return (
      <div className="compras">
        <h1>Compras</h1>
        <p>Selecione ou crie uma semana primeiro na página de Contagem.</p>
      </div>
    );
  }

  return (
    <div className="compras">
      <h1>Lançamento de Compras</h1>
      <p className="semana-info">Semana: {semana.dataInicio} a {semana.dataFim}</p>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Insumo</th>
              <th>Fornecedor</th>
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
                    <select
                      value={item.fornecedorId || ''}
                      onChange={(e) => {
                        updateItem(insumo.id, item.quantidade, item.precoUnitario, e.target.value || undefined);
                      }}
                      className="select-fornecedor"
                    >
                      <option value="">Selecione...</option>
                      {fornecedores.map(f => (
                        <option key={f.id} value={f.id}>{f.empresa}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      value={item.quantidade}
                      onChange={(e) => {
                        const qtd = parseFloat(e.target.value) || 0;
                        updateItem(insumo.id, qtd, item.precoUnitario, item.fornecedorId);
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
                        updateItem(insumo.id, item.quantidade, preco, item.fornecedorId);
                      }}
                      className="input-number"
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

