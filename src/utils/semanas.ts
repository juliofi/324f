import type { Semana } from '../types';

/**
 * Formata a data para YYYY-MM-DD
 */
function formatarData(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

/**
 * Gera as 10 semanas iniciais
 * Primeira semana: 09/11/2025 (domingo) a 15/11/2025 (sábado)
 * Segunda semana: 16/11/2025 (domingo) a 22/11/2025 (sábado)
 * E assim por diante...
 */
export function gerarSemanasIniciais(): Semana[] {
  const semanas: Semana[] = [];
  
  // Data inicial: 09/11/2025 (domingo)
  // Mês é 0-indexed, então 10 = novembro
  const dataInicial = new Date(2025, 10, 9);
  
  // Gerar 10 semanas
  for (let i = 0; i < 10; i++) {
    // Calcular data de início (domingo)
    const dataInicio = new Date(dataInicial);
    dataInicio.setDate(dataInicial.getDate() + (i * 7));
    
    // Calcular data de fim (sábado - 6 dias depois do domingo)
    const dataFim = new Date(dataInicio);
    dataFim.setDate(dataInicio.getDate() + 6);
    
    const semana: Semana = {
      id: `semana-${i + 1}`,
      dataInicio: formatarData(dataInicio),
      dataFim: formatarData(dataFim),
      estoqueInicial: [],
      compras: [],
      estoqueFinal: [],
      cmv: [],
    };
    
    semanas.push(semana);
  }
  
  return semanas;
}


/**
 * Formata a data para exibição (DD/MM/YYYY)
 */
export function formatarDataExibicao(data: string): string {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

/**
 * Formata o período da semana para exibição
 */
export function formatarPeriodoSemana(semana: Semana): string {
  const inicio = formatarDataExibicao(semana.dataInicio);
  const fim = formatarDataExibicao(semana.dataFim);
  return `${inicio} - ${fim}`;
}

