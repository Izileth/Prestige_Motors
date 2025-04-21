import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from './hooks';
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
  fetchUserStats
} from '../store/user/userThuncks';
import type {
  RegisterPayload,
  LoginPayload,
  UpdateProfilePayload,
  CreateAddressPayload,
  UpdateAddressPayload
} from '../store/user/types';
import { initialAddressesState, initialSalesState } from '../store/user/types';

import type { Action, ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/globalStore';

export const useUser = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();

  const isClient = typeof window !== 'undefined';

  // Seletores de estado atualizados
  const auth = useAppSelector(state => state.auth);
  const profile = useAppSelector(state => state.userProfile);
  const addresses = useAppSelector(state => state.userAddresses);
  const sales = useAppSelector(state => state.userSales); // Certifique-se que o nome do slice está co
  const stats = useAppSelector(state => state.userStats);

  const isAuthenticated = isClient && Boolean(auth.user);

  // Verificações comuns
  const ensureClient = useCallback(() => {
    if (!isClient) {
      throw new Error('Operação disponível apenas no client-side');
    }
  }, [isClient]);

  const ensureAuthenticated = useCallback(() => {
    ensureClient();
    if (!isAuthenticated) {
      throw new Error('Usuário não autenticado');
    }
  }, [ensureClient, isAuthenticated]);

  // Métodos de autenticação
  const signIn = useCallback(async (credentials: LoginPayload) => {
    try {
      ensureClient();
      
      const result = await dispatch(login(credentials)).unwrap();
      const user = await dispatch(login(result));
      return user;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Falha no login');
    }
  }, [dispatch, ensureClient]);

  

  const signUp = useCallback(async (userData: RegisterPayload) => {
    try {
      ensureClient();
      return await dispatch(register(userData)).unwrap();
    } catch (error) {
      throw error instanceof Error ? error : new Error('Falha no registro');
    }
  }, [dispatch, ensureClient]);

  const signOut = useCallback(async () => {
    try {
      ensureClient();
      await dispatch(logout()).unwrap();
    } catch (error) {
      // Força logout mesmo em caso de erro
      dispatch({ type: 'auth/forceLogout' });
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
      throw error instanceof Error ? error : new Error('Falha ao buscar perfil');
    }
  }, [dispatch, ensureAuthenticated]);

  const updateProfile = useCallback(async (data: UpdateProfilePayload) => {
    try {
      ensureAuthenticated();
      return await dispatch(updateCurrentProfile(data)).unwrap();
    } catch (error) {
      throw error instanceof Error ? error : new Error('Falha ao atualizar perfil');
    }
  }, [dispatch, ensureAuthenticated]);

  const deleteAccount = useCallback(async () => {
    try {
      ensureAuthenticated();
      await dispatch(deleteCurrentAccount()).unwrap();
    } catch (error) {
      throw error instanceof Error ? error : new Error('Falha ao deletar conta');
    }
  }, [dispatch, ensureAuthenticated]);

  // Métodos de endereço
  const getAddresses = useCallback(async () => {
    try {
      ensureAuthenticated();
      return await dispatch(fetchUserAddresses()).unwrap();
    } catch (error) {
      throw error instanceof Error ? error : new Error('Falha ao buscar endereços');
    }
  }, [dispatch, ensureAuthenticated]);

  const addAddress = useCallback(async (addressData: CreateAddressPayload) => {
    try {
      ensureAuthenticated();
      return await dispatch(createUserAddress(addressData)).unwrap();
    } catch (error) {
      throw error instanceof Error ? error : new Error('Falha ao criar endereço');
    }
  }, [dispatch, ensureAuthenticated]);

  const updateAddress = useCallback(async (addressId: string, addressData: UpdateAddressPayload) => {
    try {
      ensureAuthenticated();
      return await dispatch(updateUserAddress({ addressId, addressData })).unwrap();
    } catch (error) {
      throw error instanceof Error ? error : new Error('Falha ao atualizar endereço');
    }
  }, [dispatch, ensureAuthenticated]);

  const removeAddress = useCallback(async (addressId: string) => {
    try {
      ensureAuthenticated();
      await dispatch(deleteUserAddress(addressId)).unwrap();
    } catch (error) {
      throw error instanceof Error ? error : new Error('Falha ao remover endereço');
    }
  }, [dispatch, ensureAuthenticated]);

  // Métodos de vendas/compras
  const getSales = useCallback(async () => {
    try {
      ensureAuthenticated();
      return await dispatch(fetchUserSales()).unwrap();
    } catch (error) {
      throw error instanceof Error ? error : new Error('Falha ao buscar vendas');
    }
  }, [dispatch, ensureAuthenticated]);

  const getPurchases = useCallback(async () => {
    try {
      ensureAuthenticated();
      return await dispatch(fetchUserPurchases()).unwrap();
    } catch (error) {
      throw error instanceof Error ? error : new Error('Falha ao buscar compras');
    }
  }, [dispatch, ensureAuthenticated]);

  // Estatísticas
  const getStats = useCallback(async () => {
    try {
      ensureAuthenticated();
      return await dispatch(fetchUserStats()).unwrap();
    } catch (error) {
      throw error instanceof Error ? error : new Error('Falha ao buscar estatísticas');
    }
  }, [dispatch, ensureAuthenticated]);

  return {
    // Estado
    auth: isClient ? auth : { user: null, status: 'idle' },
    profile: isClient ? profile?.profile ?? null : null, // Acesso correto ao profil
    addresses: isClient ? addresses : initialAddressesState,
    sales: isClient ? sales : initialSalesState,
    stats: isClient ? stats?.stats ?? null : null, // Acesso correto aos stats
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

    // Vendas/Compras
    getSales,
    getPurchases,

    // Estatísticas
    getStats
  };
};

// Hook derivado para autenticação
export const useAuth = () => {
  const { 
    signIn, 
    signUp, 
    signOut, 
    checkSession,
    isAuthenticated, 
    auth 
  } = useUser();
  
  return {
    signIn,
    signUp,
    signOut,
    checkSession,
    isAuthenticated,
    authStatus: auth.status,
    authError: auth.user,
    user: auth.user
  };
};

// Hook derivado para perfil
export const useUserProfile = () => {
  const { 
    profile, 
    getProfile, 
    updateProfile, 
    deleteAccount 
  } = useUser();
  
  return {
    profile,
    getProfile,
    updateProfile,
    deleteAccount,
    profileStatus: profile?.status,
    profileError: profile?.error
  };
};

// Hook derivado para endereços
export const useUserAddresses = () => {
  const { 
    addresses, 
    getAddresses, 
    addAddress, 
    updateAddress,
    removeAddress
  } = useUser();
  
  return {
    addresses: addresses.addresses,
    currentAddress: addresses.currentAddress,
    getAddresses,
    addAddress,
    updateAddress,
    removeAddress,
    addressesStatus: addresses.status,
    addressesError: addresses.error
  };
};

// Hook derivado para vendas/compras
export const useUserSales = () => {
  const { 
    sales, 
    getSales, 
    getPurchases 
  } = useUser();
  
  return {
    sales: sales?.sales, // Acesso seguro às vendas
    purchases: sales?.purchases, // Acesso seguro às compras
    getSales,
    getPurchases,
    salesStatus: sales.status,
    salesError: sales.error
  };
};