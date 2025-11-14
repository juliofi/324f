import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Insumo } from '../types';
import './Insumos.css';

export function Insumos() {
  const { itens, addItem, updateItem, deleteItem } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    unidadeMedida: 'kg',
  });

  const unidadesMedida = ['kg', 'unidade', 'litro', 'caixa', 'pacote', 'lata', 'bandeja'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      updateItem(editingId, formData);
      setEditingId(null);
    } else {
      const newItem: Insumo = {
        id: Date.now().toString(),
        ...formData,
      };
      addItem(newItem);
    }
    
    setFormData({ nome: '', categoria: '', unidadeMedida: 'kg' });
    setShowForm(false);
  };

  const handleEdit = (item: Insumo) => {
    setFormData({
      nome: item.nome,
      categoria: item.categoria,
      unidadeMedida: item.unidadeMedida,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({ nome: '', categoria: '', unidadeMedida: 'kg' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="insumos">
      <div className="page-header">
        <h1>Cadastro de Itens</h1>
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
                <label>Nome do Item:</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Categoria:</label>
                <input
                  type="text"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Unidade de Medida:</label>
                <select
                  value={formData.unidadeMedida}
                  onChange={(e) => setFormData({ ...formData, unidadeMedida: e.target.value })}
                  required
                >
                  {unidadesMedida.map(uni => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingId ? 'Salvar' : 'Cadastrar'}
                </button>
                <button type="button" onClick={handleCancel} className="btn-secondary">
                  Cancelar
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
              <th>Nome</th>
              <th>Categoria</th>
              <th>Unidade de Medida</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {itens.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-state">
                  Nenhum item cadastrado
                </td>
              </tr>
            ) : (
              itens.map(item => (
                <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>{item.categoria}</td>
                  <td>{item.unidadeMedida}</td>
                  <td>
                    <button onClick={() => handleEdit(item)} className="btn-edit">
                      Editar
                    </button>
                    <button onClick={() => deleteItem(item.id)} className="btn-delete">
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

