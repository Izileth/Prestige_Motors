import { createSlice } from '@reduxjs/toolkit';
import type { ActionReducerMapBuilder, AnyAction } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  VehiclesState, 
  VehicleFilters,
  VehicleStats,
  UserVehicleStats
} from './types';
import type { 
  PaginatedResponse, 
  Vehicle,
  Avaliacao,
  StatusVeiculo
} from '../../types/types';
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
  fetchVehicleStats,
  fetchUserVehicleStats
} from './vehiclesThunks';

const initialState: VehiclesState = {
  vehicles: [],
  featuredVehicles: [],
  userVehicles: [],
  vendorVehicles: [],
  favorites: {
    data: [],
    meta: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0
    }
  },
  reviews: {
    data: [],
    meta: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0
    }
  },
  currentVehicle: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  },
  filters: {},
  stats: null,
  userStats: null,
  status: 'idle',
  uploadStatus: 'idle',
  error: null
};

const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    setFilters(state: VehiclesState, action: PayloadAction<Partial<VehicleFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state: VehiclesState) {
      state.filters = {};
    },
    setCurrentPage(state: VehiclesState, action: PayloadAction<number>) {
      state.pagination.currentPage = action.payload;
    },
    resetVehiclesState: () => initialState,
    clearCurrentVehicle(state: VehiclesState) {
      state.currentVehicle = null;
    }
  },
  extraReducers: ( builder: ActionReducerMapBuilder<VehiclesState> & { addCase: any} ) => {
    builder

      // Fetch Vehicles
      .addCase(fetchVehicles.fulfilled, (state: VehiclesState, action: PayloadAction<PaginatedResponse<Vehicle>>) => {
        state.status = 'succeeded';
        state.vehicles = action.payload.data;
        state.pagination = {
          currentPage: action.payload.meta.currentPage,
          totalPages: action.payload.meta.totalPages,
          totalItems: action.payload.meta.totalItems
        };
      })

      // Vehicle Details
      .addCase(fetchVehicleDetails.fulfilled, (state: VehiclesState, action: PayloadAction<Vehicle>) => {
        state.status = 'succeeded';
        state.currentVehicle = action.payload;
      })

      // Add Vehicle
      .addCase(addVehicle.fulfilled, (state: VehiclesState, action: PayloadAction<Vehicle>) => {
        state.status = 'succeeded';
        state.userVehicles.unshift(action.payload);
      })

      // Update Vehicle
      .addCase(updateVehicle.fulfilled, (state: VehiclesState, action: PayloadAction<Vehicle>) => {
        state.status = 'succeeded';
        state.userVehicles = state.userVehicles.map(v => 
          v.id === action.payload.id ? action.payload : v
        );
        if (state.currentVehicle?.id === action.payload.id) {
          state.currentVehicle = action.payload;
        }
      })

      // Update Vehicle Status
      .addCase(updateVehicleStatus.fulfilled, (state: VehiclesState, action: PayloadAction<Vehicle>) => {
        state.status = 'succeeded';
        state.userVehicles = state.userVehicles.map(v => 
          v.id === action.payload.id ? action.payload : v
        );
      })

      // Delete Vehicle
      .addCase(deleteVehicle.fulfilled, (state: VehiclesState, action: PayloadAction<{ vehicleId: string }>) => {
        state.status = 'succeeded';
        state.userVehicles = state.userVehicles.filter(
          v => v.id !== action.payload.vehicleId
        );
      })

      // Upload Images
      .addCase(uploadVehicleImages.pending, (state: VehiclesState) => {
        state.uploadStatus = 'loading';
      })
      .addCase(uploadVehicleImages.fulfilled, (state: VehiclesState, action: PayloadAction<{ urls: string[] }>) => {
        state.uploadStatus = 'succeeded';
        if (state.currentVehicle) {
          state.currentVehicle.imagens = [
            ...state.currentVehicle.imagens,
            ...action.payload.urls.map(url => ({ id: url, url, isMain: false }))
          ];
        }
      })
      .addCase(uploadVehicleImages.rejected, (state: VehiclesState, action: PayloadAction<string>) => {
        state.uploadStatus = 'failed';
        state.error = action.payload;
      })

      // Upload Video
      .addCase(uploadVehicleVideo.fulfilled, (state: VehiclesState, action: PayloadAction<{ url: string }>) => {
        if (state.currentVehicle) {
          state.currentVehicle.videos = [
            ...(state.currentVehicle.videos || []),
            { id: action.payload.url, url: action.payload.url }
          ];
        }
      })

      // Toggle Favorite
      .addCase(toggleVehicleFavorite.fulfilled, (state: VehiclesState, action: PayloadAction<{ vehicleId: string; favorited: boolean }>) => {
        const { vehicleId, favorited } = action.payload;
        if (favorited) {
          const vehicle = state.vehicles.find(v => v.id === vehicleId) || 
                         state.userVehicles.find(v => v.id === vehicleId);
          if (vehicle) {
            state.favorites.data = [...state.favorites.data, vehicle];
            state.favorites.meta.totalItems += 1;
          }
        } else {
          state.favorites.data = state.favorites.data.filter(v => v.id !== vehicleId);
          state.favorites.meta.totalItems -= 1;
        }
      })

      // Fetch Favorites
      .addCase(fetchFavoriteVehicles.fulfilled, (state: VehiclesState, action: PayloadAction<PaginatedResponse<Vehicle>>) => {
        state.status = 'succeeded';
        state.favorites = {
          data: action.payload.data,
          meta: {
            currentPage: action.payload.meta.currentPage,
            totalPages: action.payload.meta.totalPages,
            totalItems: action.payload.meta.totalItems
          }
        };
      })

      // Create Review
      .addCase(createVehicleReview.fulfilled, (state: VehiclesState, action: PayloadAction<Avaliacao>) => {
        if (state.currentVehicle) {
          // Adicione uma verificação de tipo para garantir segurança
          const currentVehicle = state.currentVehicle as Vehicle & { avaliacoes: Avaliacao[] };
          currentVehicle.avaliacoes = [
            ...(currentVehicle.avaliacoes || []), // Fallback para array vazio se não existir
            action.payload
          ];
        }
      })

      // Fetch Reviews
      .addCase(fetchVehicleReviews.fulfilled, (state: VehiclesState, action: PayloadAction<PaginatedResponse<Avaliacao>>) => {
        state.reviews = {
          data: action.payload.data,
          meta: {
            currentPage: action.payload.meta.currentPage,
            totalPages: action.payload.meta.totalPages,
            totalItems: action.payload.meta.totalItems
          }
        };
      })

      // Fetch Vendor Vehicles
      .addCase(fetchVendorVehicles.fulfilled, (state: VehiclesState, action: PayloadAction<PaginatedResponse<Vehicle>>) => {
        state.status = 'succeeded';
        state.vendorVehicles = action.payload.data;
      })

      // Fetch User Vehicles
      .addCase(fetchUserVehicles.fulfilled, (state: VehiclesState, action: PayloadAction<PaginatedResponse<Vehicle>>) => {
        state.status = 'succeeded';
        state.userVehicles = action.payload.data;
      })

      // Fetch Vehicle Stats
      .addCase(fetchVehicleStats.fulfilled, (state: VehiclesState, action: PayloadAction<VehicleStats>) => {
        state.stats = action.payload;
      })

      // Fetch User Vehicle Stats
      .addCase(fetchUserVehicleStats.fulfilled, (state: VehiclesState, action: PayloadAction<UserVehicleStats>) => {
        state.userStats = action.payload;
      })

      // Tratamento genérico de erros
      .addMatcher(
        (action: AnyAction) => action.type.endsWith('/pending'),
        (state: VehiclesState) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        (action: AnyAction) => action.type.endsWith('/rejected'),
        (state: VehiclesState, action: AnyAction) => {
          state.status = 'failed';
          state.error = action.payload as string || 'Ocorreu um erro';
        }
      );
  }
});

export const { 
  setFilters, 
  clearFilters, 
  resetVehiclesState,
  setCurrentPage,
  clearCurrentVehicle
} = vehiclesSlice.actions;

export default vehiclesSlice.reducer;