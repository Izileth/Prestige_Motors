import { createAsyncThunk } from '@reduxjs/toolkit';
import { vehicleService } from '~/src/services/vehicleService';
import type { 
  VehicleFilters,
} from './types';
import type { StatusVeiculo } from '../../types/types';
import type {
  Vehicle,
} from "../../types/types";

// Busca veículos com filtros
export const fetchVehicles = createAsyncThunk(
  'vehicles/fetchVehicles',
  async (filters: VehicleFilters, { rejectWithValue }) => {
    try {
      return await vehicleService.getVehicles(filters);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao buscar veículos');
    }
  }
);

// Detalhes de um veículo específico
export const fetchVehicleDetails = createAsyncThunk(
  'vehicles/fetchVehicleDetails',
  async (vehicleId: string, { rejectWithValue }) => {
    try {
      return await vehicleService.getVehicleDetails(vehicleId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao buscar detalhes');
    }
  }
);

// Criação de novo veículo
export const addVehicle = createAsyncThunk(
  'vehicles/addVehicle',
  async (vehicleData: Omit<Vehicle, 'id' | 'imagens' | 'videos'>, { rejectWithValue }) => {
    try {
      return await vehicleService.createVehicle(vehicleData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao criar veículo');
    }
  }
);

// Atualização de veículo
export const updateVehicle = createAsyncThunk(
  'vehicles/updateVehicle',
  async ({ id, data }: { id: string; data: Partial<Vehicle> }, { rejectWithValue }) => {
    try {
      return await vehicleService.updateVehicle(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao atualizar veículo');
    }
  }
);

// Atualização de status do veículo
export const updateVehicleStatus = createAsyncThunk(
  'vehicles/updateStatus',
  async ({ id, status }: { id: string; status: StatusVeiculo }, { rejectWithValue }) => {
    try {
      return await vehicleService.updateVehicleStatus(id, status);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao atualizar status');
    }
  }
);

// Deletar veículo
export const deleteVehicle = createAsyncThunk(
  'vehicles/deleteVehicle',
  async (vehicleId: string, { rejectWithValue }) => {
    try {
      await vehicleService.deleteVehicle(vehicleId);
      return { vehicleId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao deletar veículo');
    }
  }
);

// Upload de imagens
export const uploadVehicleImages = createAsyncThunk(
  'vehicles/uploadImages',
  async ({ vehicleId, images }: { vehicleId: string; images: File[] }, { rejectWithValue }) => {
    try {
      return await vehicleService.uploadImages(vehicleId, images);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro no upload de imagens');
    }
  }
);

// Upload de vídeo
export const uploadVehicleVideo = createAsyncThunk(
  'vehicles/uploadVideo',
  async ({ vehicleId, video }: { vehicleId: string; video: File }, { rejectWithValue }) => {
    try {
      return await vehicleService.uploadVideos(vehicleId, video);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro no upload de vídeo');
    }
  }
);

// Registrar visualização
export const registerVehicleView = createAsyncThunk(
  'vehicles/registerView',
  async (vehicleId: string, { rejectWithValue }) => {
    try {
      await vehicleService.registerView(vehicleId);
      return { vehicleId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao registrar visualização');
    }
  }
);

// Toggle favorito
export const toggleVehicleFavorite = createAsyncThunk(
  'vehicles/toggleFavorite',
  async (vehicleId: string, { rejectWithValue }) => {
    try {
      const response = await vehicleService.toggleFavorite(vehicleId);
      return { vehicleId, favorited: response.favorited };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao favoritar');
    }
  }
);

// Buscar favoritos
export const fetchFavoriteVehicles = createAsyncThunk(
  'vehicles/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      return await vehicleService.getFavorites();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao buscar favoritos');
    }
  }
);

// Criar avaliação
export const createVehicleReview = createAsyncThunk(
  'vehicles/createReview',
  async ({ vehicleId, reviewData }: { 
    vehicleId: string; 
    reviewData: { rating: number; comentario?: string } 
  }, { rejectWithValue }) => {
    try {
      return await vehicleService.createReview(vehicleId, reviewData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao criar avaliação');
    }
  }
);

// Buscar avaliações
export const fetchVehicleReviews = createAsyncThunk(
  'vehicles/fetchReviews',
  async (vehicleId: string, { rejectWithValue }) => {
    try {
      return await vehicleService.getReviews(vehicleId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao buscar avaliações');
    }
  }
);

// Buscar veículos do vendedor
export const fetchVendorVehicles = createAsyncThunk(
  'vehicles/fetchVendorVehicles',
  async (vendorId: string, { rejectWithValue }) => {
    try {
      return await vehicleService.getVendorVehicles(vendorId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao buscar veículos do vendedor');
    }
  }
);

// Buscar veículos do usuário logado
export const fetchUserVehicles = createAsyncThunk(
  'vehicles/fetchUserVehicles',
  async (_, { rejectWithValue }) => {
    try {
      return await vehicleService.getUserVehicles();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao buscar seus veículos');
    }
  }
);

// Buscar estatísticas gerais
export const fetchVehicleStats = createAsyncThunk(
  'vehicles/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await vehicleService.getVehicleStats();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao buscar estatísticas');
    }
  }
);

// Buscar estatísticas do usuário
export const fetchUserVehicleStats = createAsyncThunk(
  'vehicles/fetchUserStats',
  async (_, { rejectWithValue }) => {
    try {
      return await vehicleService.getUserVehicleStats();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao buscar suas estatísticas');
    }
  }
);