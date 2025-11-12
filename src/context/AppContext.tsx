import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Insumo, Fornecedor, Semana } from '../types';

interface AppContextType {
  insumos: Insumo[];
  fornecedores: Fornecedor[];
  semanas: Semana[];
  semanaAtual: string | null;
  addInsumo: (insumo: Insumo) => void;
  updateInsumo: (id: string, insumo: Partial<Insumo>) => void;
  deleteInsumo: (id: string) => void;
  addFornecedor: (fornecedor: Fornecedor) => void;
  updateFornecedor: (id: string, fornecedor: Partial<Fornecedor>) => void;
  deleteFornecedor: (id: string) => void;
  addSemana: (semana: Semana) => void;
  updateSemana: (id: string, semana: Partial<Semana>) => void;
  setSemanaAtual: (id: string | null) => void;
  getSemanaAtual: () => Semana | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [insumos, setInsumos] = useState<Insumo[]>(() => {
    const saved = localStorage.getItem('insumos');
    return saved ? JSON.parse(saved) : [];
  });

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(() => {
    const saved = localStorage.getItem('fornecedores');
    return saved ? JSON.parse(saved) : [];
  });

  const [semanas, setSemanas] = useState<Semana[]>(() => {
    const saved = localStorage.getItem('semanas');
    return saved ? JSON.parse(saved) : [];
  });

  const [semanaAtual, setSemanaAtualState] = useState<string | null>(() => {
    return localStorage.getItem('semanaAtual');
  });

  // Salvar no localStorage sempre que houver mudanças
  const saveInsumos = (newInsumos: Insumo[]) => {
    setInsumos(newInsumos);
    localStorage.setItem('insumos', JSON.stringify(newInsumos));
  };

  const saveFornecedores = (newFornecedores: Fornecedor[]) => {
    setFornecedores(newFornecedores);
    localStorage.setItem('fornecedores', JSON.stringify(newFornecedores));
  };

  const saveSemanas = (newSemanas: Semana[]) => {
    setSemanas(newSemanas);
    localStorage.setItem('semanas', JSON.stringify(newSemanas));
  };

  const addInsumo = (insumo: Insumo) => {
    saveInsumos([...insumos, insumo]);
  };

  const updateInsumo = (id: string, updates: Partial<Insumo>) => {
    saveInsumos(insumos.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const deleteInsumo = (id: string) => {
    saveInsumos(insumos.filter(i => i.id !== id));
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

  return (
    <AppContext.Provider
      value={{
        insumos,
        fornecedores,
        semanas,
        semanaAtual,
        addInsumo,
        updateInsumo,
        deleteInsumo,
        addFornecedor,
        updateFornecedor,
        deleteFornecedor,
        addSemana,
        updateSemana,
        setSemanaAtual,
        getSemanaAtual,
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

