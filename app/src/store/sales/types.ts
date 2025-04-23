import type { Venda, PaginatedResponse } from '../../types/types';
import type { SaleStatus, PaymentMethod } from '~/src/services/salesService';

// Atualize o enum para usar os mesmos valores do serviço
export type StatusVenda = SaleStatus; // Ou mantenha seu enum se precisar de valores diferentes

export interface SalesState {
  sales: PaginatedResponse<Venda>;
  sellerSales: {
    [userId: string]: PaginatedResponse<Venda>;
  };
  buyerPurchases: {
    [userId: string]: PaginatedResponse<Venda>;
  };
  vehicleSales: {
    [vehicleId: string]: PaginatedResponse<Venda>;
  };
  currentSale: Venda | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export type CreateSalePayload = {
  vehicle_id: string;
  buyer_id: string;
  sale_price: number;
  payment_method: PaymentMethod;
  installments?: number;
};

export type UpdateSaleStatusPayload = {
  status: SaleStatus; // Usando o tipo do serviço
};

export type SalesQueryParams = {
  page?: number;
  limit?: number;
  sellerId: string;
  buyerId: string;
  vehicleId: string;
};

// Novos Adicionais

export type FetchSellerSalesPayload = {
  userId: string;
  params?: SalesQueryParams;
};

export type FetchBuyerPurchasesPayload = {
  userId: string;
  params?: SalesQueryParams;
};

export type SalesByVehiclePayload = {
  vehicleId: string;
  params?: SalesQueryParams;
};

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
  sellerSales: {},
  buyerPurchases: {},
  vehicleSales: {},
  currentSale: null,
  status: 'idle',
  error: null
};
