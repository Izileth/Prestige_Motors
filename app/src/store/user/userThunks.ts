import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { 
    User, 
    Profile, 
    RegisterPayload, 
    LoginPayload, 
    UpdateProfilePayload, 
    CreateAddressPayload, 
    UpdateAddressPayload,
    Venda,
    UserStats
} from './types';

import type { Endereco, PaginatedResponse } from '../../types/types';

import {
    authService,
    profileService,
    addressService,
    statsService
} from '../../services/userService';

import { saleService } from '../../services/salesService';



// Authentication Thunks
export const register = createAsyncThunk<User, RegisterPayload>(
  'user/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      return await authService.register(payload);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro no registro');
    }
  }
);

export const login = createAsyncThunk<User, LoginPayload>(
  'user/login',
  async (credentials: LoginPayload, { rejectWithValue }) => {
    try {
      return await authService.login(credentials);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Erro desconhecido no login');
    }
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao fazer logout');
    }
  }
);

export const checkAuth = createAsyncThunk<User>(
  'user/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.checkSession();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Sessão expirada');
    }
  }
);

// Profile Thunks
export const fetchCurrentUser = createAsyncThunk<Profile>(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const userData = await profileService.getCurrentUser();
      return userData;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao buscar usuário');
    }
  }
);

export const updateCurrentProfile = createAsyncThunk<Profile, UpdateProfilePayload>(
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
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao deletar conta');
    }
  }
);

// Address Thunks
export const fetchUserAddresses = createAsyncThunk<Endereco[]>(
  'user/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      return await addressService.getMyAddresses();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao buscar endereços');
    }
  }
);

export const createUserAddress = createAsyncThunk<Endereco, CreateAddressPayload>(
  'user/createAddress',
  async (addressData: CreateAddressPayload, { rejectWithValue }) => {
    try {
      return await addressService.createAddress(addressData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao criar endereço');
    }
  }
);

export const updateUserAddress = createAsyncThunk<
  Endereco, 
  { addressId: string; addressData: UpdateAddressPayload }
>(
  'user/updateAddress',
  async ({ addressId, addressData }, { rejectWithValue }) => {
    try {
      return await addressService.updateAddress(addressId, addressData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao atualizar endereço');
    }
  }
);

export const deleteUserAddress = createAsyncThunk<string, string>(
  'user/deleteAddress',
  async (addressId: string, { rejectWithValue, fulfillWithValue }) => {
    try {
      await addressService.deleteAddress(addressId);
      return fulfillWithValue(addressId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao deletar endereço');
    }
  }
);

// Sales Thunks
// Se PaginatedResponse<Venda> é o que os serviços realmente retornam:

export const fetchUserSales = createAsyncThunk<PaginatedResponse<Venda>, string>(
  'user/fetchSales',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await saleService.getSalesBySeller(userId);
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Erro ao buscar vendas');
    }
  }
);



export const fetchUserPurchases = createAsyncThunk<PaginatedResponse<Venda>, string>(
  'user/fetchPurchases',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await saleService.getPurchasesByBuyer(userId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao buscar compras');
    }
  }
);

// Stats Thunks
export const fetchUserStats = createAsyncThunk<UserStats, string>(
  'user/fetchStats',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await statsService.getUserStats(userId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao buscar estatísticas');
    }
  }
);