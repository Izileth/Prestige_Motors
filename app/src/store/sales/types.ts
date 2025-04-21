import type { Venda, PaginatedResponse } from '../../types/types';

export enum StatusVenda {
  PENDENTE = 'PENDENTE',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA',
  REEMBOLSADA = 'REEMBOLSADA'
}

export interface SalesState {
  // Vendas gerais (paginadas)
  sales: PaginatedResponse<Venda>;
  
  // Vendas específicas de um veículo (paginadas)
  vehicleSales: PaginatedResponse<Venda>;
  
  // Venda atualmente selecionada
  currentSale: Venda | null;
  
  // Status das operações
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  
  // Mensagens de erro
  error: string | null;
}

export type CreateSalePayload = {
  vehicleId: string;
  compradorId: string;
  precoVenda: number;
  formaPagamento: string;
  parcelas?: number;
};

export interface UpdateSaleStatusPayload {
  saleId: string;
  status: StatusVenda;
}

export const initialState: SalesState = {
  sales: {
    data: [],
    meta: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false
    }
  },
  vehicleSales: {
    data: [],
    meta: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false
    }
  },
  currentSale: null,
  status: 'idle',
  error: null
};