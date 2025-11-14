import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Insumo, Fornecedor, Semana, Mercadoria } from '../types';
import { gerarSemanasIniciais } from '../utils/semanas';

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
  const [itens, setItens] = useState<Insumo[]>(() => {
    const saved = localStorage.getItem('insumos');
    return saved ? JSON.parse(saved) : [];
  });

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

  // Salvar no localStorage sempre que houver mudanças
  const saveItens = (newItens: Insumo[]) => {
    setItens(newItens);
    localStorage.setItem('insumos', JSON.stringify(newItens));
  };

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

  const addItem = (item: Insumo) => {
    saveItens([...itens, item]);
  };

  const updateItem = (id: string, updates: Partial<Insumo>) => {
    saveItens(itens.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const deleteItem = (id: string) => {
    saveItens(itens.filter(i => i.id !== id));
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

