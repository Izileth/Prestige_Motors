import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { saleService } from '~/src/services/salesService';

import type { 
  CreateSalePayload, 
  UpdateSaleStatusPayload,
  StatusVenda,

} from './types';

import type { SaleCreatePayload, SaleStatus } from '~/src/services/salesService';
import type { FetchSellerSalesPayload } from './types';


// Tipos adicionais para as novas funções
type SalesParams = {
  page?: number;
  limit?: number;
  sellerId?: string;
  buyerId?: string;
  vehicleId?: string;
};

export const createNewSale = createAsyncThunk(
  'sales/create',
  async (payload: SaleCreatePayload,  { rejectWithValue }) => {
    try {
      return await saleService.createSale(payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao criar venda');
    }
  }
);

export const fetchSaleDetails = createAsyncThunk(
  'sales/fetchDetails',
  async (saleId: string, { rejectWithValue }) => {
    try {
      return await saleService.getSaleById (saleId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao buscar venda');
    }
  }
);


export const fetchVehicleSales = createAsyncThunk(
  'sales/fetchByVehicle',
  async ({ vehicleId, params }: { vehicleId: string; params?: SalesParams }, { rejectWithValue }) => {
    try {
      return await saleService.getSaleByVehicle(vehicleId, params);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.error || error.message);
      }
      return rejectWithValue('Erro ao buscar vendas do veículo');
    }
  }
);

export const updateSale = createAsyncThunk(
  'sales/update',
  async ({ saleId, status }: { saleId: string; status: SaleStatus }, { rejectWithValue }) => {
    try {
      return await saleService.updateSaleStatus(saleId, status);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar venda';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchAllSales = createAsyncThunk(
  'sales/fetchAll',
  async (params: SalesParams = {},  { rejectWithValue }) => {
    try {
      return await saleService.getSaleAll(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao buscar vendas');
    }
  }
);


export const fetchSellerSales = createAsyncThunk(
  'sales/fetchBySeller',
  async  (userId: string,  { rejectWithValue }) => {
    try {
      const data = await  saleService.getSalesBySeller(userId);
      return { userId, data }; // Retorna tanto o userId quanto os dados
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao buscar vendas do vendedor');
    }
  }
);


export const fetchBuyerPurchases = createAsyncThunk(
  'sales/fetchByBuyer',
  async (buyerId: string, { rejectWithValue }) => {
    try {
      return await saleService.getPurchasesByBuyer(buyerId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao buscar compras do comprador');
    }
  }
);