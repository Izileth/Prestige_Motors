import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  authService,
  profileService,
  addressService,
  saleService,
  statsService
} from '../../services/userService';
import type {
  RegisterPayload,
  LoginPayload,
  UpdateProfilePayload,
  CreateAddressPayload,
  UpdateAddressPayload
} from './types';

// Authentication Thunks
export const register = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      return await authService.register(payload);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro no registro');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginPayload, { rejectWithValue }) => {
    try {
      return await authService.login(credentials);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro no login');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao fazer logout');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.checkSession();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Sessão expirada');
    }
  }
);

// Profile Thunks

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      // Garanta que o serviço retorna apenas os dados do usuário
      const userData = await profileService.getCurrentUser();
      return userData; // Retorna apenas os dados do usuário
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao buscar usuário');
    }
  }
);

export const updateCurrentProfile = createAsyncThunk(
  'user/updateProfile',
  async (data: UpdateProfilePayload, { rejectWithValue }) => {
    try {
      return await profileService.updateProfile(data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao atualizar perfil');
    }
  }
);

export const deleteCurrentAccount = createAsyncThunk(
  'user/deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      await profileService.deleteAccount();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao deletar conta');
    }
  }
);

// Address Thunks
export const fetchUserAddresses = createAsyncThunk(
  'address/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      return await addressService.getMyAddresses();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao buscar endereços');
    }
  }
);

export const createUserAddress = createAsyncThunk(
  'address/createAddress',
  async (addressData: CreateAddressPayload, { rejectWithValue }) => {
    try {
      return await addressService.createAddress(addressData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao criar endereço');
    }
  }
);

export const updateUserAddress = createAsyncThunk(
  'address/updateAddress',
  async ({ addressId, addressData }: { 
    addressId: string; 
    addressData: UpdateAddressPayload 
  }, { rejectWithValue }) => {
    try {
      return await addressService.updateAddress(addressId, addressData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao atualizar endereço');
    }
  }
);

export const deleteUserAddress = createAsyncThunk(
  'address/deleteAddress',
  async (addressId: string, { rejectWithValue }) => {
    try {
      await addressService.deleteAddress(addressId);
      return addressId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao deletar endereço');
    }
  }
);

// Sales Thunks
export const fetchUserSales = createAsyncThunk(
  'sales/fetchSales',
  async (_, { rejectWithValue }) => {
    try {
      return await saleService.getMySales();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao buscar vendas');
    }
  }
);

export const fetchUserPurchases = createAsyncThunk(
  'sales/fetchPurchases',
  async (_, { rejectWithValue }) => {
    try {
      return await saleService.getMyPurchases();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao buscar compras');
    }
  }
);

// Stats Thunks
export const fetchUserStats = createAsyncThunk(
  'stats/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await statsService.getMyStats();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao buscar estatísticas');
    }
  }
);