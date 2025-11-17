import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../../firebase';
import type { Insumo } from '../types';

const COLLECTION_NAME = 'itens';

// Buscar todos os itens
export async function getItens(): Promise<Insumo[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('nome'));
    const querySnapshot = await getDocs(q);
    const itens: Insumo[] = [];
    
    querySnapshot.forEach((docSnapshot) => {
      itens.push({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      } as Insumo);
    });
    
    return itens;
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    throw error;
  }
}

// Adicionar novo item
export async function addItem(item: Omit<Insumo, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), item);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar item:', error);
    throw error;
  }
}

// Atualizar item existente
export async function updateItem(id: string, updates: Partial<Omit<Insumo, 'id'>>): Promise<void> {
  try {
    const itemRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(itemRef, updates);
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    throw error;
  }
}

// Deletar item
export async function deleteItem(id: string): Promise<void> {
  try {
    const itemRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(itemRef);
  } catch (error) {
    console.error('Erro ao deletar item:', error);
    throw error;
  }
}

// Listener em tempo real para mudanças na coleção
export function subscribeItens(
  callback: (itens: Insumo[]) => void
): () => void {
  const q = query(collection(db, COLLECTION_NAME), orderBy('nome'));
  
  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const itens: Insumo[] = [];
      querySnapshot.forEach((docSnapshot) => {
        itens.push({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        } as Insumo);
      });
      callback(itens);
    },
    (error) => {
      console.error('Erro no listener de itens:', error);
    }
  );
  
  return unsubscribe;
}

