import { useCallback } from "react";
import { useAppSelector, useAppDispatch } from "./hooks";
import {
  login,
  register,
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
  fetchUserStats,
  setCurrentAddress,
  forceLogout,
  clearAuthError,
  clearProfile,
  clearAddresses,
  clearSales,
  clearStats,
  initialUserState
} from "../store/user/userSlice";

import type {
  RegisterPayload,
  LoginPayload,
  UpdateProfilePayload,
  CreateAddressPayload,
  UpdateAddressPayload,
} from "../store/user/types";

import type { Endereco, Venda } from "../types/types";

import type { User, Profile } from "../store/user/types";
import type { ThunkDispatch, AnyAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/globalStore";

export const useUser = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();
  const isClient = typeof window !== "undefined";

  // Seletores de estado usando a estrutura do slice unificado
  const userState = useAppSelector((state) => state.user);
  
  // Extraindo subpartes do estado para uso mais fácil
  const auth = userState.auth;
  const profile = userState.profile;
  const addresses = userState.addresses;
  const sales = userState.sales;
  const stats = userState.stats;

  const isAuthenticated = isClient && Boolean(auth.user);

  // Verificações comuns
  const ensureClient = useCallback(() => {
    if (!isClient) {
      throw new Error("Operação disponível apenas no client-side");
    }
  }, [isClient]);

  const ensureAuthenticated = useCallback(() => {
    ensureClient();
    if (!isAuthenticated) {
      throw new Error("Usuário não autenticado");
    }
  }, [ensureClient, isAuthenticated]);

  const signIn = useCallback(
    async (credentials: LoginPayload) => {
      try {
        ensureClient();
        return await dispatch(login(credentials)).unwrap();
      } catch (error) {
        throw error instanceof Error ? error : new Error("Falha no login");
      }
    },
    [dispatch, ensureClient]
  );

  const signUp = useCallback(
    async (userData: RegisterPayload) => {
      try {
        ensureClient();
        return await dispatch(register(userData)).unwrap();
      } catch (error) {
        throw error instanceof Error ? error : new Error("Falha no registro");
      }
    },
    [dispatch, ensureClient]
  );

  const signOut = useCallback(async () => {
    try {
      ensureClient();
      await dispatch(logout()).unwrap();
    } catch (error) {
      // Força logout mesmo em caso de erro
      dispatch(forceLogout());
    }
  }, [dispatch, ensureClient]);

  const checkSession = useCallback(async () => {
    try {
      ensureClient();
      await dispatch(checkAuth()).unwrap();
    } catch (error) {
      // Sessão inválida ou erro, o estado já é limpo pelo reducer
    }
  }, [dispatch, ensureClient]);

  // Métodos de perfil
  const getProfile = useCallback(async () => {
    try {
      ensureAuthenticated();
      return await dispatch(fetchCurrentUser()).unwrap();
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Falha ao buscar perfil");
    }
  }, [dispatch, ensureAuthenticated]);

  const updateProfile = useCallback(
    async (data: UpdateProfilePayload) => {
      try {
        ensureAuthenticated();
        return await dispatch(updateCurrentProfile(data)).unwrap();
      } catch (error) {
        throw error instanceof Error
          ? error
          : new Error("Falha ao atualizar perfil");
      }
    },
    [dispatch, ensureAuthenticated]
  );

  const deleteAccount = useCallback(async () => {
    try {
      ensureAuthenticated();
      await dispatch(deleteCurrentAccount()).unwrap();
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Falha ao deletar conta");
    }
  }, [dispatch, ensureAuthenticated]);

  // Métodos de endereço
  const getAddresses = useCallback(async () => {
    try {
      ensureAuthenticated();
      return await dispatch(fetchUserAddresses()).unwrap();
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Falha ao buscar endereços");
    }
  }, [dispatch, ensureAuthenticated]);

  const addAddress = useCallback(
    async (addressData: CreateAddressPayload) => {
      try {
        ensureAuthenticated();
        return await dispatch(createUserAddress(addressData)).unwrap();
      } catch (error) {
        throw error instanceof Error
          ? error
          : new Error("Falha ao criar endereço");
      }
    },
    [dispatch, ensureAuthenticated]
  );

  const updateAddress = useCallback(
    async (addressId: string, addressData: UpdateAddressPayload) => {
      try {
        ensureAuthenticated();
        return await dispatch(
          updateUserAddress({ addressId, addressData })
        ).unwrap();
      } catch (error) {
        throw error instanceof Error
          ? error
          : new Error("Falha ao atualizar endereço");
      }
    },
    [dispatch, ensureAuthenticated]
  );

  const removeAddress = useCallback(
    async (addressId: string) => {
      try {
        ensureAuthenticated();
        await dispatch(deleteUserAddress(addressId)).unwrap();
      } catch (error) {
        throw error instanceof Error
          ? error
          : new Error("Falha ao remover endereço");
      }
    },
    [dispatch, ensureAuthenticated]
  );

  const setSelectedAddress = useCallback(
    (address: Endereco | null) => {
      dispatch(setCurrentAddress(address));
    },
    [dispatch]
  );

  // Métodos de vendas/compras
  const getSales = useCallback(async () => {
    try {
      ensureAuthenticated();
      return await dispatch(fetchUserSales()).unwrap();
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Falha ao buscar vendas");
    }
  }, [dispatch, ensureAuthenticated]);

  const getPurchases = useCallback(async () => {
    try {
      ensureAuthenticated();
      if (!auth.user?.id) throw new Error("User ID not available");
      return await dispatch(fetchUserPurchases(auth.user.id)).unwrap();
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Falha ao buscar compras");
    }
  }, [dispatch, ensureAuthenticated, auth.user?.id]);

  // Estatísticas
  const getStats = useCallback(async () => {
    try {
      ensureAuthenticated();
      if (!auth.user?.id) throw new Error("User ID not available");
      return await dispatch(fetchUserStats(auth.user.id)).unwrap();
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Falha ao buscar estatísticas");
    }
  }, [dispatch, ensureAuthenticated, auth.user?.id]);

  return {
    // Estado
    auth: isClient ? auth : initialUserState.auth,
    profile: isClient ? profile : initialUserState.profile,
    addresses: isClient ? addresses : initialUserState.addresses,
    sales: isClient ? sales : initialUserState.sales,
    stats: isClient ? stats : initialUserState.stats,
    isAuthenticated,

    // Autenticação
    signIn,
    signUp,
    signOut,
    checkSession,

    // Perfil
    getProfile,
    updateProfile,
    deleteAccount,

    // Endereços
    getAddresses,
    addAddress,
    updateAddress,
    removeAddress,
    setSelectedAddress,

    // Vendas/Compras
    getSales,
    getPurchases,

    // Estatísticas
    getStats,

    // Ações de limpeza
    clearAuthError: () => dispatch(clearAuthError()),
    clearProfile: () => dispatch(clearProfile()),
    clearAddresses: () => dispatch(clearAddresses()),
    clearSales: () => dispatch(clearSales()),
    clearStats: () => dispatch(clearStats()),
  };
};

// Hook derivado para autenticação
export const useAuth = () => {
  const { auth, signIn, signUp, signOut, checkSession, isAuthenticated, clearAuthError } = useUser();

  return {
    signIn,
    signUp,
    signOut,
    checkSession,
    clearAuthError,
    isAuthenticated,
    authStatus: auth.status,
    authError: auth.error,
    user: auth.user,
  };
};

// Hook derivado para perfil
export const useUserProfile = () => {
  const { profile, getProfile, updateProfile, deleteAccount, clearProfile } = useUser();

  return {
    profile: profile.profile,
    getProfile,
    updateProfile,
    deleteAccount,
    clearProfile,
    profileStatus: profile.status,
    profileError: profile.error,
  };
};

// Hook derivado para endereços
export const useUserAddresses = () => {
  const { 
    addresses, 
    getAddresses, 
    addAddress, 
    updateAddress, 
    removeAddress, 
    setSelectedAddress,
    clearAddresses
  } = useUser();

  return {
    addresses: addresses.addresses,
    currentAddress: addresses.currentAddress,
    getAddresses,
    addAddress,
    updateAddress,
    removeAddress,
    setSelectedAddress,
    clearAddresses,
    addressesStatus: addresses.status,
    addressesError: addresses.error,
  };
};

// Hook derivado para vendas/compras
export const useUserSales = () => {
  const { sales, getSales, getPurchases, clearSales } = useUser();

  return {
    sales: sales.sales,
    purchases: sales.purchases,
    getSales,
    getPurchases,
    clearSales,
    salesStatus: sales.status,
    salesError: sales.error,
  };
};

// Hook derivado para estatísticas
export const useUserStats = () => {
  const { stats, getStats, clearStats } = useUser();

  return {
    stats: stats.stats,
    getStats,
    clearStats,
    statsStatus: stats.status,
    statsError: stats.error,
  };
};