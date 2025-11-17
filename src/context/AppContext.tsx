import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Insumo, Fornecedor, Semana, Mercadoria } from '../types';
import { gerarSemanasIniciais } from '../utils/semanas';
import { subscribeItens, addItem as addItemFirestore, updateItem as updateItemFirestore, deleteItem as deleteItemFirestore } from '../services/itensService';

interface AppContextType {
  itens: Insumo[];
  fornecedores: Fornecedor[];
  semanas: Semana[];
  semanaAtual: string | null;
  mercadorias: Mercadoria[];
  addItem: (item: Insumo) => void;
  updateItem: (id: string, item: Partial<Insumo>) => void;
  deleteItem: (id: string) => void;
  addFornecedor: (fornecedor: Fornecedor) => void;
  updateFornecedor: (id: string, fornecedor: Partial<Fornecedor>) => void;
  deleteFornecedor: (id: string) => void;
  addSemana: (semana: Semana) => void;
  updateSemana: (id: string, semana: Partial<Semana>) => void;
  setSemanaAtual: (id: string | null) => void;
  getSemanaAtual: () => Semana | null;
  addMercadoria: (mercadoria: Mercadoria) => void;
  updateMercadoria: (id: string, mercadoria: Partial<Mercadoria>) => void;
  deleteMercadoria: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<Insumo[]>([]);

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(() => {
    const saved = localStorage.getItem('fornecedores');
    return saved ? JSON.parse(saved) : [];
  });

  const [semanas, setSemanas] = useState<Semana[]>(() => {
    // Sempre gerar as 10 semanas iniciais do zero
    const semanasGeradas = gerarSemanasIniciais();
    localStorage.setItem('semanas', JSON.stringify(semanasGeradas));
    // Limpar semana atual antiga se existir
    localStorage.removeItem('semanaAtual');
    return semanasGeradas;
  });

  const [semanaAtual, setSemanaAtualState] = useState<string | null>(() => {
    return null; // Sem semana selecionada por padrão
  });

  const [mercadorias, setMercadorias] = useState<Mercadoria[]>(() => {
    const saved = localStorage.getItem('mercadorias');
    return saved ? JSON.parse(saved) : [];
  });

  // Sincronizar itens com Firestore em tempo real
  useEffect(() => {
    const unsubscribe = subscribeItens((newItens) => {
      setItens(newItens);
    });

    return () => unsubscribe();
  }, []);

  const saveFornecedores = (newFornecedores: Fornecedor[]) => {
    setFornecedores(newFornecedores);
    localStorage.setItem('fornecedores', JSON.stringify(newFornecedores));
  };

  const saveSemanas = (newSemanas: Semana[]) => {
    setSemanas(newSemanas);
    localStorage.setItem('semanas', JSON.stringify(newSemanas));
  };

  const saveMercadorias = (newMercadorias: Mercadoria[]) => {
    setMercadorias(newMercadorias);
    localStorage.setItem('mercadorias', JSON.stringify(newMercadorias));
  };

  const addItem = async (item: Insumo) => {
    try {
      const { id, ...itemData } = item;
      await addItemFirestore(itemData);
      // O listener em tempo real atualizará o estado automaticamente
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      throw error;
    }
  };

  const updateItem = async (id: string, updates: Partial<Insumo>) => {
    try {
      const { id: _, ...updateData } = updates;
      await updateItemFirestore(id, updateData);
      // O listener em tempo real atualizará o estado automaticamente
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await deleteItemFirestore(id);
      // O listener em tempo real atualizará o estado automaticamente
    } catch (error) {
      console.error('Erro ao deletar item:', error);
      throw error;
    }
  };

  const addFornecedor = (fornecedor: Fornecedor) => {
    saveFornecedores([...fornecedores, fornecedor]);
  };

  const updateFornecedor = (id: string, updates: Partial<Fornecedor>) => {
    saveFornecedores(fornecedores.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteFornecedor = (id: string) => {
    saveFornecedores(fornecedores.filter(f => f.id !== id));
  };

  const addSemana = (semana: Semana) => {
    saveSemanas([...semanas, semana]);
  };

  const updateSemana = (id: string, updates: Partial<Semana>) => {
    saveSemanas(semanas.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const setSemanaAtual = (id: string | null) => {
    setSemanaAtualState(id);
    if (id) {
      localStorage.setItem('semanaAtual', id);
    } else {
      localStorage.removeItem('semanaAtual');
    }
  };

  const getSemanaAtual = (): Semana | null => {
    if (!semanaAtual) return null;
    return semanas.find(s => s.id === semanaAtual) || null;
  };

  const addMercadoria = (mercadoria: Mercadoria) => {
    saveMercadorias([...mercadorias, mercadoria]);
  };

  const updateMercadoria = (id: string, updates: Partial<Mercadoria>) => {
    saveMercadorias(mercadorias.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteMercadoria = (id: string) => {
    saveMercadorias(mercadorias.filter(m => m.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        itens,
        fornecedores,
        semanas,
        semanaAtual,
        mercadorias,
        addItem,
        updateItem,
        deleteItem,
        addFornecedor,
        updateFornecedor,
        deleteFornecedor,
        addSemana,
        updateSemana,
        setSemanaAtual,
        getSemanaAtual,
        addMercadoria,
        updateMercadoria,
        deleteMercadoria,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

