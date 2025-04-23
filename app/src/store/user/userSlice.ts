import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { 
  UserState, 
  User, 
  Profile, 
  RegisterPayload, 
  LoginPayload, 
  UpdateProfilePayload, 
  CreateAddressPayload, 
  UpdateAddressPayload,
  PaginatedData,
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

import type { RootState } from '../globalStore';
;


function convertToPaginatedData<T>(response: PaginatedResponse<T>): PaginatedData<T> {
  return {
    items: response.data || [],
    meta: {
      currentPage: response.meta.currentPage,
      totalPages: response.meta.totalPages,
      totalItems: response.meta.totalItems
    }
  };
}





// Estado inicial unificado com tipos apropriados
export const initialUserState: UserState = {
  auth: {
    user: null,
    status: 'idle',
    error: null
  },
  profile: {
    profile: null,
    status: 'idle',
    error: null
  },
  addresses: {
    addresses: [],
    currentAddress: null,
    status: 'idle',
    error: null
  },
  sales: {
    sales: {
      items: [],
      meta: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
      }
    },
    purchases: {
      items: [],
      meta: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
      }
    },
    status: 'idle',
    error: null
  },
  stats: {
    stats: null,
    status: 'idle',
    error: null
  }
};

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
export const fetchUserSales = createAsyncThunk<PaginatedResponse<Venda>>(
  'user/fetchSales',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = state.user.auth.user?.id;
      if (!userId) throw new Error('Usuário não autenticado');
      
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

// Slice unificado
const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    // Auth reducers
    forceLogout: (state) => {
      state.auth.user = null;
      state.auth.status = 'idle';
      state.auth.error = null;
      // Limpa os outros estados também
      state.profile.profile = null;
      state.addresses.addresses = [];
      state.addresses.currentAddress = null;
      state.sales.sales.items = [];
      state.sales.purchases.items = [];
      state.stats.stats = null;
    },
    clearAuthError: (state) => {
      state.auth.error = null;
    },
    
    // Profile reducers
    clearProfile: (state) => {
      state.profile.profile = null;
      state.profile.status = 'idle';
      state.profile.error = null;
    },
    
    // Addresses reducers
    setCurrentAddress: (state, action: PayloadAction<Endereco | null>) => {
      state.addresses.currentAddress = action.payload;
    },
    clearAddresses: (state) => {
      state.addresses.addresses = [];
      state.addresses.currentAddress = null;
      state.addresses.status = 'idle';
      state.addresses.error = null;
    },
    
    // Sales reducers
    clearSales: (state) => {
      state.sales.sales = {
        items: [],
        meta: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0
        }
      };
      state.sales.purchases = {
        items: [],
        meta: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0
        }
      };
      state.sales.status = 'idle';
      state.sales.error = null;
    },
    setSalesPage: (state, action: PayloadAction<number>) => {
      state.sales.sales.meta.currentPage = action.payload;
    },
    setPurchasesPage: (state, action: PayloadAction<number>) => {
      state.sales.purchases.meta.currentPage = action.payload;
    },
    
    // Stats reducers
    clearStats: (state) => {
      state.stats.stats = null;
      state.stats.status = 'idle';
      state.stats.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.auth.status = 'loading';
        state.auth.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.auth.status = 'succeeded';
        state.auth.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.auth.status = 'failed';
        state.auth.error = action.payload as string;
      })
      
      // Login
      .addCase(login.pending, (state) => {
        state.auth.status = 'loading';
        state.auth.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.auth.user = action.payload;
        state.auth.status = 'succeeded';
      })
      .addCase(login.rejected, (state, action) => {
        state.auth.error = action.payload as string;
        state.auth.status = 'failed';
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.auth.status = 'loading';
      })
      .addCase(logout.fulfilled, (state) => {
        state.auth.user = null;
        state.auth.status = 'idle';
      })
      .addCase(logout.rejected, (state, action) => {
        state.auth.error = action.payload as string;
        state.auth.status = 'failed';
      })
      
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.auth.status = 'loading';
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.auth.user = action.payload;
        state.auth.status = 'succeeded';
      })
      .addCase(checkAuth.rejected, (state) => {
        state.auth.user = null;
        state.auth.status = 'idle';
      })
      
      // Profile
      .addCase(fetchCurrentUser.pending, (state) => {
        state.profile.status = 'loading';
        state.profile.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.profile.status = 'succeeded';
        state.profile.profile = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.profile.status = 'failed';
        state.profile.error = action.payload as string;
      })
      .addCase(updateCurrentProfile.pending, (state) => {
        state.profile.status = 'loading';
        state.profile.error = null;
      })
      .addCase(updateCurrentProfile.fulfilled, (state, action) => {
        state.profile.status = 'succeeded';
        if (state.profile.profile) {
          state.profile.profile = { ...state.profile.profile, ...action.payload };
        }
      })
      .addCase(updateCurrentProfile.rejected, (state, action) => {
        state.profile.status = 'failed';
        state.profile.error = action.payload as string;
      })
      .addCase(deleteCurrentAccount.pending, (state) => {
        state.profile.status = 'loading';
      })
      
      // Addresses
      .addCase(fetchUserAddresses.pending, (state) => {
        state.addresses.status = 'loading';
        state.addresses.error = null;
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.addresses.status = 'succeeded';
        state.addresses.addresses = action.payload;
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.addresses.status = 'failed';
        state.addresses.error = action.payload as string;
      })
      .addCase(createUserAddress.pending, (state) => {
        state.addresses.status = 'loading';
        state.addresses.error = null;
      })
      .addCase(createUserAddress.fulfilled, (state, action) => {
        state.addresses.status = 'succeeded';
        state.addresses.addresses.push(action.payload);
      })
      .addCase(createUserAddress.rejected, (state, action) => {
        state.addresses.status = 'failed';
        state.addresses.error = action.payload as string;
      })
      .addCase(updateUserAddress.pending, (state) => {
        state.addresses.status = 'loading';
        state.addresses.error = null;
      })
      .addCase(updateUserAddress.fulfilled, (state, action) => {
        state.addresses.status = 'succeeded';
        state.addresses.addresses = state.addresses.addresses.map(addr => 
          addr.id === action.payload.id ? action.payload : addr
        );
        if (state.addresses.currentAddress?.id === action.payload.id) {
          state.addresses.currentAddress = action.payload;
        }
      })
      .addCase(updateUserAddress.rejected, (state, action) => {
        state.addresses.status = 'failed';
        state.addresses.error = action.payload as string;
      })
      .addCase(deleteUserAddress.pending, (state) => {
        state.addresses.status = 'loading';
        state.addresses.error = null;
      })
      .addCase(deleteUserAddress.fulfilled, (state, action) => {
        state.addresses.status = 'succeeded';
        state.addresses.addresses = state.addresses.addresses.filter(
          addr => addr.id !== action.payload
        );
        if (state.addresses.currentAddress?.id === action.payload) {
          state.addresses.currentAddress = null;
        }
      })
      .addCase(deleteUserAddress.rejected, (state, action) => {
        state.addresses.status = 'failed';
        state.addresses.error = action.payload as string;
      })
      
      // Sales
      .addCase(fetchUserSales.pending, (state) => {
        state.sales.status = 'loading';
        state.sales.error = null;
      })
      .addCase(fetchUserSales.fulfilled, (state, action) => {
        state.sales.status = 'succeeded';
        state.sales.sales = convertToPaginatedData(action.payload);
      })
      .addCase(fetchUserSales.rejected, (state, action) => {
        state.sales.status = 'failed';
        state.sales.error = action.payload as string;
      })
      .addCase(fetchUserPurchases.pending, (state) => {
        state.sales.status = 'loading';
        state.sales.error = null;
      })
      .addCase(fetchUserPurchases.fulfilled, (state, action) => {
        state.sales.status = 'succeeded';
        state.sales.purchases = convertToPaginatedData(action.payload);
      })
      .addCase(fetchUserPurchases.rejected, (state, action) => {
        state.sales.status = 'failed';
        state.sales.error = action.payload as string;
      })
      
      // Stats
      .addCase(fetchUserStats.pending, (state) => {
        state.stats.status = 'loading';
        state.stats.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.stats.status = 'succeeded';
        state.stats.stats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.stats.status = 'failed';
        state.stats.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  forceLogout,
  clearAuthError,
  clearProfile,
  setCurrentAddress,
  clearAddresses,
  clearSales,
  setSalesPage,
  setPurchasesPage,
  clearStats
} = userSlice.actions;

// Export reducer
export const userReducer = userSlice.reducer;