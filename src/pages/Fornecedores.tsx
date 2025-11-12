import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Fornecedor } from '../types';
import './Fornecedores.css';

export function Fornecedores() {
  const { fornecedores, addFornecedor, updateFornecedor, deleteFornecedor } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    empresa: '',
    vendedor: '',
    whatsapp: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      updateFornecedor(editingId, formData);
      setEditingId(null);
    } else {
      const newFornecedor: Fornecedor = {
        id: Date.now().toString(),
        ...formData,
      };
      addFornecedor(newFornecedor);
    }
    
    setFormData({ empresa: '', vendedor: '', whatsapp: '' });
    setShowForm(false);
  };

  const handleEdit = (fornecedor: Fornecedor) => {
    setFormData({
      empresa: fornecedor.empresa,
      vendedor: fornecedor.vendedor,
      whatsapp: fornecedor.whatsapp,
    });
    setEditingId(fornecedor.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({ empresa: '', vendedor: '', whatsapp: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="fornecedores">
      <div className="page-header">
        <h1>Cadastro de Fornecedores</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Novo Fornecedor
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Editar Fornecedor' : 'Novo Fornecedor'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Empresa:</label>
                <input
                  type="text"
                  value={formData.empresa}
                  onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Vendedor:</label>
                <input
                  type="text"
                  value={formData.vendedor}
                  onChange={(e) => setFormData({ ...formData, vendedor: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>WhatsApp:</label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="(00) 00000-0000"
                  required
                />
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
              <th>Empresa</th>
              <th>Vendedor</th>
              <th>WhatsApp</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {fornecedores.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-state">
                  Nenhum fornecedor cadastrado
                </td>
              </tr>
            ) : (
              fornecedores.map(fornecedor => (
                <tr key={fornecedor.id}>
                  <td>{fornecedor.empresa}</td>
                  <td>{fornecedor.vendedor}</td>
                  <td>{fornecedor.whatsapp}</td>
                  <td>
                    <button onClick={() => handleEdit(fornecedor)} className="btn-edit">
                      Editar
                    </button>
                    <button onClick={() => deleteFornecedor(fornecedor.id)} className="btn-delete">
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

