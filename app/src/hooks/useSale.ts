import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import {
  createNewSale,
  fetchSaleDetails,
  fetchVehicleSales,
  updateSale,
  fetchAllSales,
  fetchSellerSales,
  fetchBuyerPurchases
} from '../store/sales/saleThuncks';
import type { 
  CreateSalePayload, 
  UpdateSaleStatusPayload,
  SalesQueryParams
} from '../store/sales/types';
import type { Action, ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/globalStore';
import type { PaginatedResponse, Venda } from '../types/types';
import type { SaleStatus } from '../services/salesService';


export const useSales = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();
  const { 
    sales, 
    currentSale, 
    status, 
    error,
    sellerSales,
    buyerPurchases,
    vehicleSales
  } = useAppSelector(state => state.sales);

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

  // Todas as vendas (paginadas)
  const getAllSales = useCallback(async (params?: SalesQueryParams) => {
    try {
      const result = await dispatch(fetchAllSales(params || {})).unwrap();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar vendas';
      throw new Error(errorMessage);
    }
  }, [dispatch]);

  // Vendas por veículo
  const getVehicleSales = useCallback(async (vehicleId: string, params?: SalesQueryParams) => {
    try {
      const result = await dispatch(fetchVehicleSales(vehicleId, params)).unwrap();
      return result.data; // Retorna apenas os dados da paginação
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar vendas do veículo';
      throw new Error(errorMessage);
    }
  }, [dispatch]);
  

  // Vendas por vendedor
  const getSellerSales = useCallback(async (sellerId: string, params?: SalesQueryParams) => {
    try {
      const result = await dispatch(fetchSellerSales(sellerId, params)).unwrap();
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar vendas do vendedor';
      throw new Error(errorMessage);
    }
  }, [dispatch]);

  // Compras por comprador
  const getBuyerPurchases = useCallback(async (buyerId: string, params?: SalesQueryParams) => {
    try {
      const result = await dispatch(fetchBuyerPurchases(buyerId, params)).unwrap();
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar compras do comprador';
      throw new Error(errorMessage);
    }
  }, [dispatch]);


  const updateStatus = useCallback(async (saleId: string, status: SaleStatus) => {
    try {
      const result = await dispatch(updateSale({ saleId, status })).unwrap();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status da venda';
      throw new Error(errorMessage);
    }
  }, [dispatch]);

  return {
    // Estado
    sales,
    currentSale,
    sellerSales,
    buyerPurchases,
    vehicleSales,
    isLoading: status === 'loading',
    error,
    
    // Métodos
    registerSale,
    getSale,
    getAllSales,
    getVehicleSales,
    getSellerSales,
    getBuyerPurchases,
    updateStatus,
    
    // Helpers
    hasSales: sales.data?.length > 0
  };
};

// Hook especializado para vendas de veículos
export const useVehicleSales = (vehicleId?: string) => {
  const { 
    vehicleSales,
    getVehicleSales,
    registerSale,
    isLoading 
  } = useSales();

  const loadSales = useCallback(async (params?: SalesQueryParams) => {
    if (!vehicleId) return;
    return getVehicleSales(vehicleId, params);
  }, [vehicleId, getVehicleSales]);

  

  return {
    vehicleSales: vehicleSales[vehicleId || '']?.data || [],
    pagination: vehicleSales[vehicleId || '']?.meta,
    registerVehicleSale: registerSale,
    loadVehicleSales: loadSales,
    isLoading
  };
};

// Hook especializado para vendas por vendedor
export const useSellerSales = (sellerId?: string) => {
  const { 
    sellerSales,
    getSellerSales,
    isLoading 
  } = useSales();

  const loadSales = useCallback(async (params?: SalesQueryParams) => {
    if (!sellerId) return;
    return getSellerSales(sellerId, params);
  }, [sellerId, getSellerSales]);

  return {
    sales: sellerSales[sellerId || '']?.data || [],
    pagination: sellerSales[sellerId || '']?.meta,
    loadSales,
    isLoading
  };
};

// Hook especializado para compras por comprador
export const useBuyerPurchases = (buyerId?: string) => {
  const { 
    buyerPurchases,
    getBuyerPurchases,
    isLoading 
  } = useSales();

  const loadPurchases = useCallback(async (params?: SalesQueryParams) => {
    if (!buyerId) return;
    return getBuyerPurchases(buyerId, params);
  }, [buyerId, getBuyerPurchases]);

  return {
    purchases: buyerPurchases[buyerId || '']?.data || [],
    pagination: buyerPurchases[buyerId || '']?.meta,
    loadPurchases,
    isLoading
  };
};

// Hook especializado para gestão de uma venda específica
export const useSaleManagement = (saleId?: string) => {
  const { 
    currentSale, 
    getSale, 
    updateStatus,
    isLoading 
  } = useSales();

  const loadSale = useCallback(async () => {
    if (!saleId) return;
    return getSale(saleId);
  }, [saleId, getSale]);

  return {
    sale: currentSale,
    loadSale,
    updateStatus,
    isLoading: isLoading || (saleId ? currentSale?.id !== saleId : false)
  };
};