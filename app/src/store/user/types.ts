import type { Endereco} from '../../types/types';
// Payloads para ações
export interface RegisterPayload {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface UpdateProfilePayload {
  nome?: string;
  email?: string;
  senha?: string;
  telefone?: string;
  avatar?: string;
  [key: string]: any;
}

export interface CreateAddressPayload {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;

}

export interface UpdateAddressPayload {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  [key: string]: any;
}

// Tipos para os modelos de dados
export interface User {
  id: string;
  name?: string;
  email?: string;
  // outros campos do usuário
  [key: string]: any;
}

export interface Profile {
  // campos do perfil
  [key: string]: any;
}

export interface Venda {
  id: string;
  [key: string]: any;
}

export interface UserStats {
  // campos das estatísticas
  [key: string]: any;
}

// Tipos para o estado
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface PaginatedData<T> {
  items: T[];
  meta: PaginationMeta;
}

// Estados para as diferentes seções
export interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface ProfileState {
  profile: Profile | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface AddressesState {
  addresses: Endereco[];
  currentAddress: Endereco | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface SalesState {
  sales: PaginatedData<Venda>;
  purchases: PaginatedData<Venda>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface StatsState {
  stats: UserStats | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface StatsProcess {
  pending: boolean,
  fulfilled: boolean,
  rejected: boolean,
  error: string | null;
}

// Estado unificado para o slice
export interface UserState {
  auth: AuthState;
  profile: ProfileState;
  addresses: AddressesState;
  sales: SalesState;
  stats: StatsState;

}
