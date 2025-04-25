import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { 
  UserState, 
  PaginatedData,
} from './types';
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
  } from '../user';
import type { Endereco, PaginatedResponse } from '../../types/types';

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
  },

};

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
        // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.profile.status = 'loading';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.profile.profile = action.payload;
        state.profile.status = 'succeeded';
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.profile.status = 'failed';
        state.profile.error = action.payload as string;
      })

      // Update Profile
      .addCase(updateCurrentProfile.pending, (state) => {
        state.profile.status = 'loading';
      })
      .addCase(updateCurrentProfile.fulfilled, (state, action) => {
        state.profile.profile = action.payload;
        state.profile.status = 'succeeded';
      })
      .addCase(updateCurrentProfile.rejected, (state, action) => {
        state.profile.status = 'failed';
        state.profile.error = action.payload as string;
      })

      // Delete Account
      .addCase(deleteCurrentAccount.fulfilled, (state) => {
        state.auth.user = null;
        state.profile.profile = null;
      })

      // Fetch Addresses
      .addCase(fetchUserAddresses.pending, (state) => {
        state.addresses.status = 'loading';
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.addresses.addresses = action.payload;
        state.addresses.status = 'succeeded';
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.addresses.status = 'failed';
        state.addresses.error = action.payload as string;
      })

      // Create Address
      .addCase(createUserAddress.fulfilled, (state, action) => {
        state.addresses.addresses.push(action.payload);
      })

      // Update Address
      .addCase(updateUserAddress.fulfilled, (state, action) => {
        const index = state.addresses.addresses.findIndex(
          addr => addr.id === action.payload.id
        );
        if (index !== -1) {
          state.addresses.addresses[index] = action.payload;
        }
      })

      // Delete Address
      .addCase(deleteUserAddress.fulfilled, (state, action) => {
        state.addresses.addresses = state.addresses.addresses.filter(
          addr => addr.id !== action.payload
        );
      })

      // Fetch Sales
      .addCase(fetchUserSales.pending, (state) => {
        state.sales.status = 'loading';
      })
      .addCase(fetchUserSales.fulfilled, (state, action) => {
        state.sales.sales = convertToPaginatedData(action.payload);
        state.sales.status = 'succeeded';
      })
      .addCase(fetchUserSales.rejected, (state, action) => {
        state.sales.status = 'failed';
        state.sales.error = action.payload as string;
      })

      // Fetch Purchases
      .addCase(fetchUserPurchases.pending, (state) => {
        state.sales.status = 'loading';
      })
      .addCase(fetchUserPurchases.fulfilled, (state, action) => {
        state.sales.purchases = convertToPaginatedData(action.payload);
        state.sales.status = 'succeeded';
      })
      .addCase(fetchUserPurchases.rejected, (state, action) => {
        state.sales.status = 'failed';
        state.sales.error = action.payload as string;
      })

      // Fetch Stats
      .addCase(fetchUserStats.pending, (state) => {
        state.stats.status = 'loading';
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.stats.stats = action.payload;
        state.stats.status = 'succeeded';
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