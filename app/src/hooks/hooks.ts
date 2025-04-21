import { useDispatch, useSelector, useStore } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '~/src/store/globalStore';

const isClientSide = typeof window !== 'undefined';

export const useAppDispatch = () => {
  try {
    // Tenta obter o dispatch normalmente
    const dispatch = useDispatch<AppDispatch>();
    return dispatch;
  } catch (error) {
    // Fallback para SSR ou quando o Redux não está disponível
    if (process.env.NODE_ENV === 'development') {
      console.warn('Dispatch não disponível - retornando função mock', error);
    }
    
    // Retorna uma função mock que rejeita todas as ações
    return () => {
      return Promise.reject('Redux não está disponível no ambiente atual');
    };
  }
};

export const useAppSelector: TypedUseSelectorHook<RootState> = (selector) => {
  try {
    if (!isClientSide) {
      // Retorna um valor padrão seguro durante SSR
      return undefined as any;
    }
    return useSelector(selector);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('useSelector falhou - retornando valor padrão', error);
    }
    return undefined as any;
  }
};

export const useReduxAvailable = () => {
  if (!isClientSide) return false;
  
  try {
    useStore();
    return true;
  } catch {
    return false;
  }
};