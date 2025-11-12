import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Insumo } from '../types';
import './Insumos.css';

export function Insumos() {
  const { insumos, addInsumo, updateInsumo, deleteInsumo } = useApp();
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
      updateInsumo(editingId, formData);
      setEditingId(null);
    } else {
      const newInsumo: Insumo = {
        id: Date.now().toString(),
        ...formData,
      };
      addInsumo(newInsumo);
    }
    
    setFormData({ nome: '', categoria: '', unidadeMedida: 'kg' });
    setShowForm(false);
  };

  const handleEdit = (insumo: Insumo) => {
    setFormData({
      nome: insumo.nome,
      categoria: insumo.categoria,
      unidadeMedida: insumo.unidadeMedida,
    });
    setEditingId(insumo.id);
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
        <h1>Cadastro de Insumos</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Novo Insumo
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Editar Insumo' : 'Novo Insumo'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome do Insumo:</label>
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
            {insumos.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-state">
                  Nenhum insumo cadastrado
                </td>
              </tr>
            ) : (
              insumos.map(insumo => (
                <tr key={insumo.id}>
                  <td>{insumo.nome}</td>
                  <td>{insumo.categoria}</td>
                  <td>{insumo.unidadeMedida}</td>
                  <td>
                    <button onClick={() => handleEdit(insumo)} className="btn-edit">
                      Editar
                    </button>
                    <button onClick={() => deleteInsumo(insumo.id)} className="btn-delete">
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

