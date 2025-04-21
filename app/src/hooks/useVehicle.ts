import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import {
  fetchVehicles,
  fetchVehicleDetails,
  addVehicle,
  updateVehicle,
  updateVehicleStatus,
  deleteVehicle,
  uploadVehicleImages,
  uploadVehicleVideo,
  registerVehicleView,
  toggleVehicleFavorite,
  fetchFavoriteVehicles,
  createVehicleReview,
  fetchVehicleReviews,
  fetchVendorVehicles,
  fetchUserVehicles,
  fetchVehicleStats
} from '../store/vehicles/vehiclesThunks';
import type { VehicleFilters } from '../store/vehicles/types';
import type {
  Vehicle,
  StatusVeiculo,
} from '../types/types';

import type { Action, ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/globalStore';

export const useVehicles = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();
  const state = useAppSelector(state => state.vehicles);

  // Busca de veículos
  const getVehicles = useCallback(async (filters: VehicleFilters) => {
    return dispatch(fetchVehicles(filters)).unwrap();
  }, [dispatch]);

  // Detalhes do veículo
  const getVehicleDetails = useCallback(async (id: string) => {
    const result = await dispatch(fetchVehicleDetails(id)).unwrap();
    dispatch(registerVehicleView(id)); // Registra visualização
    return result;
  }, [dispatch]);

  // Veículos do usuário
  const getUserVehicles = useCallback(async () => {
    return dispatch(fetchUserVehicles()).unwrap();
  }, [dispatch]);

  // Veículos do vendedor
  const getVendorVehicles = useCallback(async (vendorId: string) => {
    return dispatch(fetchVendorVehicles(vendorId)).unwrap();
  }, [dispatch]);

  // CRUD de veículos
  const createVehicle = useCallback(async (vehicleData: Omit<Vehicle, 'id' | 'imagens' | 'videos'>) => {
    return dispatch(addVehicle(vehicleData)).unwrap();
  }, [dispatch]);

  const editVehicle = useCallback(async (id: string, vehicleData: Partial<Vehicle>) => {
    return dispatch(updateVehicle({ id, data: vehicleData })).unwrap();
  }, [dispatch]);

  const changeVehicleStatus = useCallback(async (id: string, status: StatusVeiculo) => {
    return dispatch(updateVehicleStatus({ id, status })).unwrap();
  }, [dispatch]);

  const removeVehicle = useCallback(async (id: string) => {
    await dispatch(deleteVehicle(id)).unwrap();
    return id; // Retorna o ID para referência
  }, [dispatch]);

  // Mídia
  const uploadImages = useCallback(async (vehicleId: string, images: File[]) => {
    return dispatch(uploadVehicleImages({ vehicleId, images })).unwrap();
  }, [dispatch]);

  const uploadVideo = useCallback(async (vehicleId: string, video: File) => {
    return dispatch(uploadVehicleVideo({ vehicleId, video })).unwrap();
  }, [dispatch]);

  // Favoritos
  const toggleFavorite = useCallback(async (vehicleId: string) => {
    return dispatch(toggleVehicleFavorite(vehicleId)).unwrap();
  }, [dispatch]);

  const getFavorites = useCallback(async () => {
    return dispatch(fetchFavoriteVehicles()).unwrap();
  }, [dispatch]);

  // Avaliações
  const createReview = useCallback(async (vehicleId: string, reviewData: { rating: number; comentario?: string }) => {
    return dispatch(createVehicleReview({ vehicleId, reviewData })).unwrap();
  }, [dispatch]);

  const getReviews = useCallback(async (vehicleId: string) => {
    return dispatch(fetchVehicleReviews(vehicleId)).unwrap();
  }, [dispatch]);

  // Estatísticas
  const getStats = useCallback(async () => {
    return dispatch(fetchVehicleStats()).unwrap();
  }, [dispatch]);

  // Efeitos automáticos (opcional)
  useEffect(() => {
    if (state.status === 'idle') {
      getVehicles({ page: 1, limit: 12 });
    }
  }, [getVehicles, state.status]);

  return {
    // Estado
    ...state,
    
    // Buscas
    getVehicles,
    getVehicleDetails,
    getUserVehicles,
    getVendorVehicles,
    
    // CRUD
    createVehicle,
    updateVehicle: editVehicle,
    updateVehicleStatus: changeVehicleStatus,
    deleteVehicle: removeVehicle,
    
    // Mídia
    uploadImages,
    uploadVideo,
    
    // Favoritos
    toggleFavorite,
    getFavorites,
    
    // Avaliações
    createReview,
    getReviews,
    
    // Estatísticas
    getStats,
    
    // Helpers
    isUploading: state.uploadStatus === 'loading',
    isLoading: state.status === 'loading'
  };
};

// Hook especializado para detalhes do veículo
export const useVehicleDetails = (id: string) => {
  const { 
    currentVehicle, 
    getVehicleDetails,
    uploadImages,
    uploadVideo,
    toggleFavorite,
    createReview
  } = useVehicles();

  useEffect(() => {
    if (!currentVehicle || currentVehicle.id !== id) {
      getVehicleDetails(id);
    }
  }, [id, currentVehicle, getVehicleDetails]);

  return {
    vehicle: currentVehicle,
    uploadImages,
    uploadVideo,
    toggleFavorite,
    createReview,
    isLoading: !currentVehicle || currentVehicle.id !== id
  };
};

// Hook especializado para listagem
export const useVehicleList = (initialFilters?: VehicleFilters) => {
  const {
    vehicles,
    pagination,
    filters,
    getVehicles,
    isLoading
  } = useVehicles();

  const loadVehicles = useCallback((newFilters?: VehicleFilters) => {
    return getVehicles({ ...filters, ...newFilters });
  }, [filters, getVehicles]);

  // Carrega inicialmente com os filtros padrão ou fornecidos
  useEffect(() => {
    loadVehicles(initialFilters);
  }, [loadVehicles, initialFilters]);

  return {
    vehicles,
    pagination,
    filters,
    loadVehicles,
    isLoading,
    hasMore: pagination.currentPage < pagination.totalPages
  };
};
