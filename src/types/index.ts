export interface Insumo {
  id: string;
  nome: string;
  categoria: string;
  unidadeMedida: string;
}

export interface Fornecedor {
  id: string;
  empresa: string;
  vendedor: string;
  whatsapp: string;
}

export interface EstoqueItem {
  insumoId: string;
  quantidade: number;
  precoUnitario: number;
  precoTotal: number;
}

export interface EstoqueInicial extends EstoqueItem {
  semana: string;
}

export interface Compra extends EstoqueItem {
  semana: string;
  fornecedorId?: string;
}

export interface EstoqueFinal extends EstoqueItem {
  semana: string;
}

export interface CMV extends EstoqueItem {
  semana: string;
}

export interface CotacaoItem {
  insumoId: string;
  quantidade: number;
  fornecedorId: string;
  preco: number;
}

export interface Cotacao {
  semana: string;
  itens: CotacaoItem[];
}

export interface Semana {
  id: string;
  dataInicio: string;
  dataFim: string;
  estoqueInicial: EstoqueInicial[];
  compras: Compra[];
  estoqueFinal: EstoqueFinal[];
  cmv: CMV[];
}
