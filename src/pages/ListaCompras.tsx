import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { CMV } from '../types';
import './ListaCompras.css';

export function ListaCompras() {
  const { insumos, getSemanaAtual, updateSemana } = useApp();
  const semana = getSemanaAtual();
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    if (semana) {
      calcularCMV();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semana?.id, semana?.estoqueInicial?.length, semana?.compras?.length, semana?.estoqueFinal?.length]);

  const calcularCMV = () => {
    if (!semana) return;

    const cmv: CMV[] = insumos.map(insumo => {
      const ei = semana.estoqueInicial.find(e => e.insumoId === insumo.id);
      const c = semana.compras.find(c => c.insumoId === insumo.id);
      const ef = semana.estoqueFinal.find(e => e.insumoId === insumo.id);

      const qtdEI = ei?.quantidade || 0;
      const qtdC = c?.quantidade || 0;
      const qtdEF = ef?.quantidade || 0;
      const quantidadeCMV = qtdEI + qtdC - qtdEF;

      // Preço unitário do EF deve ser igual ao da compra (C)
      const precoUnitario = c?.precoUnitario || ef?.precoUnitario || 0;
      const precoTotal = quantidadeCMV * precoUnitario;

      return {
        insumoId: insumo.id,
        quantidade: quantidadeCMV,
        precoUnitario,
        precoTotal,
        semana: semana.id,
      };
    });

    updateSemana(semana.id, { cmv });
  };

  const getItensParaComprar = () => {
    if (!semana) return [];

    return semana.cmv
      .filter(cmv => {
        const ei = semana.estoqueInicial.find(e => e.insumoId === cmv.insumoId);
        const qtdEI = ei?.quantidade || 0;
        return qtdEI <= cmv.quantidade;
      })
      .map(cmv => {
        const insumo = insumos.find(i => i.id === cmv.insumoId);
        const quantidadeComprar = cmv.quantidade * 1.2;
        return {
          insumo,
          quantidade: quantidadeComprar,
          cmv: cmv.quantidade,
        };
      })
      .filter(item => item.insumo);
  };

  const gerarMensagem = () => {
    const itens = getItensParaComprar();
    let mensagem = 'Olá, segue lista para cotação:\n\n';
    
    itens.forEach(item => {
      mensagem += `${item.quantidade.toFixed(2)}${item.insumo?.unidadeMedida} de ${item.insumo?.nome}\n`;
    });

    if (observacoes) {
      mensagem += `\nObs: ${observacoes}`;
    }

    return mensagem;
  };

  const copiarMensagem = () => {
    const mensagem = gerarMensagem();
    navigator.clipboard.writeText(mensagem);
    alert('Mensagem copiada para a área de transferência!');
  };

  if (!semana) {
    return (
      <div className="lista-compras">
        <h1>Lista de Compras</h1>
        <p>Selecione ou crie uma semana primeiro na página de Contagem.</p>
      </div>
    );
  }

  const itensParaComprar = getItensParaComprar();

  return (
    <div className="lista-compras">
      <h1>Lista de Compras</h1>
      <p className="semana-info">Semana: {semana.dataInicio} a {semana.dataFim}</p>

      <div className="info-box">
        <p><strong>Regra:</strong> Um item deve ser comprado quando o Estoque Inicial (EI) em quantidade for menor ou igual ao CMV em quantidade.</p>
        <p><strong>Quantidade a comprar:</strong> CMV × 1,2</p>
      </div>

      <div className="observacoes-box">
        <label>Observações para a mensagem:</label>
        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Digite observações que serão incluídas na mensagem..."
          rows={3}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Insumo</th>
              <th>CMV (Qtd.)</th>
              <th>EI (Qtd.)</th>
              <th>Quantidade a Comprar</th>
            </tr>
          </thead>
          <tbody>
            {itensParaComprar.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-state">
                  Nenhum item precisa ser comprado no momento
                </td>
              </tr>
            ) : (
              itensParaComprar.map(item => {
                const ei = semana.estoqueInicial.find(e => e.insumoId === item.insumo?.id);
                return (
                  <tr key={item.insumo?.id}>
                    <td>{item.insumo?.nome} ({item.insumo?.unidadeMedida})</td>
                    <td>{item.cmv.toFixed(2)}</td>
                    <td>{(ei?.quantidade || 0).toFixed(2)}</td>
                    <td><strong>{item.quantidade.toFixed(2)} {item.insumo?.unidadeMedida}</strong></td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {itensParaComprar.length > 0 && (
        <div className="mensagem-box">
          <h3>Mensagem para Fornecedores:</h3>
          <div className="mensagem-content">
            <pre>{gerarMensagem()}</pre>
          </div>
          <button onClick={copiarMensagem} className="btn-primary">
            Copiar Mensagem
          </button>
        </div>
      )}
    </div>
  );
}

