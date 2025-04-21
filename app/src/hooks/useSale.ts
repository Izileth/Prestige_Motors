import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import {
  createNewSale,
  fetchSaleDetails,
  fetchVehicleSales,
  updateSale,
} from '../store/sales/saleThuncks';
import type { 
  CreateSalePayload, 
  UpdateSaleStatusPayload,
} from '../store/sales/types';

import type { Action, ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/globalStore';


export const useSales = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();
  const { sales, currentSale, status, error } = useAppSelector(state => state.sales);

  // Criação de venda
  const registerSale = useCallback(async (saleData: CreateSalePayload) => {
    try {
      const result = await dispatch(createNewSale(saleData)).unwrap();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar venda';
      throw new Error(errorMessage);
    }
  }, [dispatch]);

  // Detalhes da venda
  const getSale = useCallback(async (saleId: string) => {
    try {
      const result = await dispatch(fetchSaleDetails(saleId)).unwrap();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar detalhes da venda';
      throw new Error(errorMessage);
    }
  }, [dispatch]);

  // Vendas por veículo
  const getVehicleSales = useCallback(async (vehicleId: string) => {
    try {
      const result = await dispatch(fetchVehicleSales(vehicleId)).unwrap();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar vendas do veículo';
      throw new Error(errorMessage);
    }
  }, [dispatch]);

  // Atualização de status
  const updateStatus = useCallback(async (payload: UpdateSaleStatusPayload) => {
    try {
      const result = await dispatch(updateSale(payload)).unwrap();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status da venda';
      throw new Error(errorMessage);
    }
  }, [dispatch]);

  // Relatórios e estatísticas
  const generateSalesReport = useCallback(async (params: {
    startDate?: string;
    endDate?: string;
    sellerId?: string;
  }) => {
    // Implementação específica conforme sua API
    return {
      totalSales: 0,
      totalRevenue: 0,
      byStatus: {},
      byVehicleType: {}
    };
  }, []);

  return {
    // Estado
    sales,
    currentSale,
    isLoading: status === 'loading',
    error,
    
    // Métodos
    registerSale,
    getSale,
    getVehicleSales,
    updateSaleStatus: updateStatus,
    generateSalesReport,
    
    // Helpers
    hasSales: sales.data?.length > 0
  };
};

// Hook especializado para vendas de veículos
export const useVehicleSales = (vehicleId?: string) => {
  const { 
    sales,
    getVehicleSales,
    registerSale,
    isLoading 
  } = useSales();

  const loadSales = useCallback(async () => {
    if (!vehicleId) return;
    return getVehicleSales(vehicleId);
  }, [vehicleId, getVehicleSales]);

  return {
    vehicleSales: sales.data || [],
    pagination: sales.meta,
    registerVehicleSale: registerSale,
    loadVehicleSales: loadSales,
    isLoading
  };
};

// Hook especializado para gestão de uma venda específica
export const useSaleManagement = (saleId?: string) => {
  const { 
    currentSale, 
    getSale, 
    updateSaleStatus,
    isLoading 
  } = useSales();

  const loadSale = useCallback(async () => {
    if (!saleId) return;
    return getSale(saleId);
  }, [saleId, getSale]);

  return {
    sale: currentSale,
    loadSale,
    updateStatus: updateSaleStatus,
    isLoading: isLoading || (saleId ? currentSale?.id !== saleId : false)
  };
};