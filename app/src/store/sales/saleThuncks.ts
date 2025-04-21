import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { 
  createSale, 
  getSaleDetails, 
  getSalesByVehicle, 
  updateSaleStatus,

  getSales
} from '../../services/salesService';
import type { 
  CreateSalePayload, 
  UpdateSaleStatusPayload ,
  StatusVenda 
} from './types';
export const createNewSale = createAsyncThunk(
    'sales/createSale',
    async (payload: CreateSalePayload, { rejectWithValue }) => {
        try {
        return await createSale(payload);
        } catch (error: any) {
        return rejectWithValue(error.response?.data?.error || 'Erro ao criar venda');
        }
    }
);

export const fetchSaleDetails = createAsyncThunk(
    'sales/getSaleDetails',
    async (saleId: string, { rejectWithValue }) => {
        try {
        return await getSaleDetails(saleId);
        } catch (error: any) {
        return rejectWithValue(error.response?.data?.error || 'Erro ao buscar venda');
        }
    }
);

export const fetchVehicleSales = createAsyncThunk(
    'sales/getSalesByVehicle',
    async (vehicleId: string, { rejectWithValue }) => {
      try {
        return await getSalesByVehicle(vehicleId);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          return rejectWithValue(error.response?.data?.error || error.message);
        }
        return rejectWithValue('Erro desconhecido ao buscar vendas do veículo');
      }
    }
  );


export const updateSale = createAsyncThunk(
    'sales/updateSaleStatus',
    async ({ saleId, status }: { saleId: string; status: StatusVenda }, { rejectWithValue }) => {
      try {
        return await updateSaleStatus(saleId, { status });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar venda';
        return rejectWithValue(errorMessage);
      }
    }
);

export const fetchSales = createAsyncThunk(
    'sales/fetchSales',
    async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
      try {
        return await getSales(params);
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.error || 'Erro ao buscar vendas');
      }
    }
  );
