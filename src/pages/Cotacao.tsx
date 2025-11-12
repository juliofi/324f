import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './Cotacao.css';

interface ItemCotacao {
  insumoId: string;
  quantidade: number;
  precos: { [fornecedorId: string]: number };
  vencedores: { fornecedorId: string; preco: number }[];
}

export function Cotacao() {
  const { insumos, fornecedores, getSemanaAtual } = useApp();
  const semana = getSemanaAtual();
  const [itensCotacao, setItensCotacao] = useState<ItemCotacao[]>([]);
  const [observacoes, setObservacoes] = useState('');
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<string>('');

  useEffect(() => {
    if (semana) {
      carregarItensParaCotacao();
    }
  }, [semana, insumos]);

  const carregarItensParaCotacao = () => {
    if (!semana) return;

    const itens = semana.cmv
      .filter(cmv => {
        const ei = semana.estoqueInicial.find(e => e.insumoId === cmv.insumoId);
        const qtdEI = ei?.quantidade || 0;
        return qtdEI <= cmv.quantidade;
      })
      .map(cmv => {
        const quantidadeComprar = cmv.quantidade * 1.2;
        return {
          insumoId: cmv.insumoId,
          quantidade: quantidadeComprar,
          precos: {} as { [fornecedorId: string]: number },
          vencedores: [] as { fornecedorId: string; preco: number }[],
        };
      });

    setItensCotacao(itens);
  };

  const atualizarPreco = (insumoId: string, fornecedorId: string, preco: number) => {
    setItensCotacao(prev => prev.map(item => {
      if (item.insumoId === insumoId) {
        const novosPrecos = { ...item.precos, [fornecedorId]: preco };
        const vencedores = calcularVencedores(novosPrecos);
        return { ...item, precos: novosPrecos, vencedores };
      }
      return item;
    }));
  };

  const calcularVencedores = (precos: { [fornecedorId: string]: number }) => {
    const precosArray = Object.entries(precos)
      .filter(([_, preco]) => preco > 0)
      .map(([fornecedorId, preco]) => ({ fornecedorId, preco }))
      .sort((a, b) => a.preco - b.preco);

    return [
      precosArray[0] || null,
      precosArray[1] || null,
      precosArray[2] || null,
    ].filter(Boolean) as { fornecedorId: string; preco: number }[];
  };

  const selecionarFornecedor = (insumoId: string, fornecedorId: string) => {
    setItensCotacao(prev => prev.map(item => {
      if (item.insumoId === insumoId) {
        const novosVencedores = [...item.vencedores];
        const fornecedor = novosVencedores.find(v => v.fornecedorId === fornecedorId);
        if (!fornecedor) {
          const preco = item.precos[fornecedorId] || 0;
          novosVencedores.push({ fornecedorId, preco });
          novosVencedores.sort((a, b) => a.preco - b.preco);
        }
        return { ...item, vencedores: novosVencedores };
      }
      return item;
    }));
  };


  const getItensPorFornecedor = (fornecedorId: string) => {
    return itensCotacao
      .filter(item => item.vencedores.some(v => v.fornecedorId === fornecedorId))
      .map(item => {
        const insumo = insumos.find(i => i.id === item.insumoId);
        return { insumo, quantidade: item.quantidade };
      })
      .filter(item => item.insumo);
  };

  const gerarMensagemFornecedor = (fornecedorId: string) => {
    const fornecedor = fornecedores.find(f => f.id === fornecedorId);
    if (!fornecedor) return '';

    const itens = getItensPorFornecedor(fornecedorId);
    let mensagem = `Olá ${fornecedor.empresa}, segue encomenda:\n\n`;
    
    itens.forEach(item => {
      mensagem += `${item.quantidade.toFixed(2)}${item.insumo?.unidadeMedida} de ${item.insumo?.nome}\n`;
    });

    if (observacoes) {
      mensagem += `\nObs: ${observacoes}`;
    }

    return mensagem;
  };

  const copiarMensagem = (fornecedorId: string) => {
    const mensagem = gerarMensagemFornecedor(fornecedorId);
    navigator.clipboard.writeText(mensagem);
    alert('Mensagem copiada para a área de transferência!');
  };

  if (!semana) {
    return (
      <div className="cotacao">
        <h1>Cotação</h1>
        <p>Selecione ou crie uma semana primeiro na página de Contagem.</p>
      </div>
    );
  }

  return (
    <div className="cotacao">
      <h1>Cotação de Fornecedores</h1>
      <p className="semana-info">Semana: {semana.dataInicio} a {semana.dataFim}</p>

      <div className="observacoes-box">
        <label>Observações para as mensagens:</label>
        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Digite observações que serão incluídas nas mensagens..."
          rows={3}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Insumo</th>
              <th>Qtd.</th>
              {fornecedores.map(fornecedor => (
                <th key={fornecedor.id}>{fornecedor.empresa}</th>
              ))}
              <th>Vencedor 1</th>
              <th>Vencedor 2</th>
              <th>Vencedor 3</th>
              <th>Selecionar</th>
            </tr>
          </thead>
          <tbody>
            {itensCotacao.map(item => {
              const insumo = insumos.find(i => i.id === item.insumoId);
              return (
                <tr key={item.insumoId}>
                  <td>{insumo?.nome} ({insumo?.unidadeMedida})</td>
                  <td>{item.quantidade.toFixed(2)}</td>
                  {fornecedores.map(fornecedor => {
                    const preco = item.precos[fornecedor.id] || 0;
                    const isVencedor = item.vencedores.some(v => v.fornecedorId === fornecedor.id);
                    return (
                      <td key={fornecedor.id}>
                        <input
                          type="number"
                          step="0.01"
                          value={preco || ''}
                          onChange={(e) => {
                            const valor = parseFloat(e.target.value) || 0;
                            atualizarPreco(item.insumoId, fornecedor.id, valor);
                          }}
                          className={`input-preco ${isVencedor ? 'vencedor' : ''}`}
                          placeholder="0.00"
                        />
                      </td>
                    );
                  })}
                  <td>
                    {item.vencedores[0] && (
                      <span className="vencedor-badge">
                        {fornecedores.find(f => f.id === item.vencedores[0].fornecedorId)?.empresa} - R$ {item.vencedores[0].preco.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td>
                    {item.vencedores[1] && (
                      <span className="vencedor-badge">
                        {fornecedores.find(f => f.id === item.vencedores[1].fornecedorId)?.empresa} - R$ {item.vencedores[1].preco.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td>
                    {item.vencedores[2] && (
                      <span className="vencedor-badge">
                        {fornecedores.find(f => f.id === item.vencedores[2].fornecedorId)?.empresa} - R$ {item.vencedores[2].preco.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td>
                    <select
                      value={fornecedorSelecionado}
                      onChange={(e) => {
                        if (e.target.value) {
                          selecionarFornecedor(item.insumoId, e.target.value);
                          setFornecedorSelecionado('');
                        }
                      }}
                      className="select-fornecedor"
                    >
                      <option value="">Escolher...</option>
                      {fornecedores.map(f => (
                        <option key={f.id} value={f.id}>{f.empresa}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mensagens-fornecedores">
        <h2>Mensagens por Fornecedor</h2>
        {fornecedores.map(fornecedor => {
          const itens = getItensPorFornecedor(fornecedor.id);
          if (itens.length === 0) return null;

          return (
            <div key={fornecedor.id} className="mensagem-fornecedor">
              <h3>{fornecedor.empresa} - {fornecedor.vendedor}</h3>
              <div className="mensagem-content">
                <pre>{gerarMensagemFornecedor(fornecedor.id)}</pre>
              </div>
              <button onClick={() => copiarMensagem(fornecedor.id)} className="btn-primary">
                Copiar Mensagem
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

