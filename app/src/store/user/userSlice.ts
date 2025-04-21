import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  initialAuthState,
  initialProfileState,
  initialAddressesState,
  initialSalesState,
  initialStatsState,
} from './types';
import type { Endereco, Venda } from '../../types/types';
import {
  register,
  login,
  logout,
  checkAuth,
  fetchCurrentUser,
  updateCurrentProfile,
  deleteCurrentAccount,
  fetchUserAddresses,
  createUserAddress,
  updateUserAddress,
  deleteUserAddress,
  fetchUserSales,
  fetchUserPurchases,
  fetchUserStats
} from './userThuncks'

// Auth slice - Simplificado para trabalhar apenas com user
const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    // Ação de logout síncrono (usado quando o interceptor detecta 401)
    forceLogout(state) {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = 'idle';
      })
      .addCase(checkAuth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.status = 'idle';
        state.user = null;
      })
      .addCase(deleteCurrentAccount.fulfilled, (state) => {
        state.user = null;
        state.status = 'idle';
      });
  },
});

// Profile slice - Agora focado apenas no usuário atual
const profileSlice = createSlice({
  name: 'profile',
  initialState: initialProfileState,
  reducers: {
    clearProfile(state) {
      state.profile = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = {
          ...action.payload,
          status: 'succeeded', // Adiciona os campos faltantes
          error: null
        };
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateCurrentProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateCurrentProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (state.profile) {
          state.profile = { ...state.profile, ...action.payload };
        }
      })
      .addCase(updateCurrentProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(deleteCurrentAccount.pending, (state) => {
        state.status = 'loading';
      });
  },
});

// Addresses slice - Mantém a mesma estrutura mas sem userId
const addressesSlice = createSlice({
  name: 'addresses',
  initialState: initialAddressesState,
  reducers: {
    setCurrentAddress(state, action: PayloadAction<Endereco | null>) {
      state.currentAddress = action.payload;
    },
    clearAddresses(state) {
      state.addresses = [];
      state.currentAddress = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAddresses.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.addresses = action.payload;
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createUserAddress.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createUserAddress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.addresses.push(action.payload);
      })
      .addCase(createUserAddress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateUserAddress.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUserAddress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.addresses = state.addresses.map(addr => 
          addr.id === action.payload.id ? action.payload : addr
        );
        if (state.currentAddress?.id === action.payload.id) {
          state.currentAddress = action.payload;
        }
      })
      .addCase(updateUserAddress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(deleteUserAddress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
        if (state.currentAddress?.id === action.payload) {
          state.currentAddress = null;
        }
      });
  },
});

// Sales slice - Agora separa claramente vendas e compras
const salesSlice = createSlice({
  name: 'sales',
  initialState: initialSalesState,
  reducers: {
    clearSales(state) {
      state.sales = initialSalesState.sales;
      state.purchases = initialSalesState.purchases;
      state.status = 'idle';
      state.error = null;
    },
    setSalesPage(state, action: PayloadAction<number>) {
      state.sales.meta.currentPage = action.payload;
    },
    setPurchasesPage(state, action: PayloadAction<number>) {
      state.purchases.meta.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSales.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserSales.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sales = action.payload;
      })
      .addCase(fetchUserSales.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchUserPurchases.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserPurchases.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.purchases = action.payload;
      })
      .addCase(fetchUserPurchases.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Stats slice - Mantém a mesma estrutura
const statsSlice = createSlice({
  name: 'stats',
  initialState: initialStatsState,
  reducers: {
    clearStats(state) {
      state.stats = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { 
  forceLogout, 
  clearAuthError,
} = authSlice.actions;

export const { 
  clearProfile,
} = profileSlice.actions;

export const { 
  setCurrentAddress, 
  clearAddresses,
} = addressesSlice.actions;

export const { 
  clearSales,
  setSalesPage,
  setPurchasesPage,
} = salesSlice.actions;

export const {
  clearStats,
} = statsSlice.actions;

// Export reducers
export const authReducer = authSlice.reducer;
export const profileReducer = profileSlice.reducer;
export const addressesReducer = addressesSlice.reducer;
export const salesReducer = salesSlice.reducer;
export const statsReducer = statsSlice.reducer;