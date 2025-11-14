import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { EstoqueInicial } from '../types';
import { formatarPeriodoSemana } from '../utils/semanas';
import './Estoque.css';

export function Estoque() {
  const { itens, semanaAtual, semanas, updateSemana } = useApp();
  const semana = semanas.find(s => s.id === semanaAtual);
  const estoqueInicial = semana?.estoqueInicial || [];

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    insumoId: '',
    quantidade: 0,
    precoUnitario: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!semana) {
      alert('Selecione uma semana na sidebar primeiro!');
      return;
    }

    const precoTotal = formData.quantidade * formData.precoUnitario;
    const novoItem: EstoqueInicial = {
      insumoId: formData.insumoId,
      quantidade: formData.quantidade,
      precoUnitario: formData.precoUnitario,
      precoTotal: precoTotal,
      semana: semana.id,
    };

    const novosItens = editingId
      ? estoqueInicial.map(item => item.insumoId === editingId ? novoItem : item)
      : [...estoqueInicial, novoItem];

    updateSemana(semana.id, { estoqueInicial: novosItens });
    
    setFormData({ 
      insumoId: '', 
      quantidade: 0, 
      precoUnitario: 0 
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item: EstoqueInicial) => {
    setFormData({
      insumoId: item.insumoId,
      quantidade: item.quantidade,
      precoUnitario: item.precoUnitario,
    });
    setEditingId(item.insumoId);
    setShowForm(true);
  };

  const handleDelete = (insumoId: string) => {
    if (!semana) return;
    
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      const novosItens = estoqueInicial.filter(item => item.insumoId !== insumoId);
      updateSemana(semana.id, { estoqueInicial: novosItens });
    }
  };

  const handleCancel = () => {
    setFormData({ 
      insumoId: '', 
      quantidade: 0, 
      precoUnitario: 0 
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getItemNome = (itemId: string) => {
    const item = itens.find(i => i.id === itemId);
    return item ? `${item.nome} (${item.unidadeMedida})` : 'Item não encontrado';
  };

  const getItemCategoria = (itemId: string) => {
    const item = itens.find(i => i.id === itemId);
    return item ? item.categoria : '-';
  };

  const getItemUnidade = (itemId: string) => {
    const item = itens.find(i => i.id === itemId);
    return item ? item.unidadeMedida : '-';
  };

  if (!semana) {
    return (
      <div className="estoque">
        <div className="page-header">
          <h1>Estoque Inicial</h1>
        </div>
        <div className="semana-alert">
          <p>Selecione uma semana na sidebar para visualizar e gerenciar o estoque inicial.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="estoque">
      <div className="page-header">
        <h1>
          Estoque Inicial <span className="semana-info-header">({formatarPeriodoSemana(semana)})</span>
        </h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Novo Item
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Editar Item' : 'Novo Item'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Item:</label>
                <select
                  value={formData.insumoId}
                  onChange={(e) => setFormData({ ...formData, insumoId: e.target.value })}
                  required
                >
                  <option value="">Selecione um item</option>
                  {itens.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.nome} ({item.unidadeMedida})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Quantidade:</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.quantidade}
                    onChange={(e) => setFormData({ ...formData, quantidade: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Preço Unitário (R$):</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.precoUnitario}
                    onChange={(e) => setFormData({ ...formData, precoUnitario: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={handleCancel} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Salvar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Categoria</th>
              <th>Quantidade</th>
              <th>Preço Unitário</th>
              <th>Valor Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {estoqueInicial.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  Nenhum item cadastrado para esta semana
                </td>
              </tr>
            ) : (
              estoqueInicial.map(item => (
                <tr key={item.insumoId}>
                  <td>{getItemNome(item.insumoId)}</td>
                  <td>{getItemCategoria(item.insumoId)}</td>
                  <td>{item.quantidade} {getItemUnidade(item.insumoId)}</td>
                  <td>{formatCurrency(item.precoUnitario)}</td>
                  <td>{formatCurrency(item.precoTotal)}</td>
                  <td>
                    <button onClick={() => handleEdit(item)} className="btn-edit">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(item.insumoId)} className="btn-delete">
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
