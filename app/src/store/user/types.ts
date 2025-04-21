import type { User, Endereco, Venda, PaginatedResponse } from '../../types/types';

// Estado de autenticação simplificado (sem token)
export interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Estado do perfil do usuário
export interface UserProfileState {
  profile: (User & {
    enderecos: Endereco[];
    vendasComoVendedor: Venda[];
    vendasComoComprador: Venda[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    
  }) | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Estado dos endereços
export interface AddressesState {
  addresses: Endereco[];
  currentAddress: Endereco | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Estado de vendas e compras
export interface SalesState {
  sales: PaginatedResponse<Venda>;
  purchases: PaginatedResponse<Venda>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Estado de estatísticas
export interface StatsState {
  stats: UserStats | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Tipos de payload para operações
export type RegisterPayload = {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cpf?: string;
  dataNascimento?: string;
};

export type LoginPayload = {
  email: string;
  password?: string;
};

export type LoginResponse = User;

export type CreateAddressPayload = Omit<Endereco, "id" | "userId">;

export type UpdateAddressPayload = Partial<CreateAddressPayload>;

export type UpdateProfilePayload = Partial<{
  nome: string;
  telefone: string;
  avatar: string;
}>;

export type UserStats = {
  totalSales: number;
  totalPurchases: number;
  favoriteVehicleType: string | null;
  totalVehicles?: number;
  averageRating?: number;
};

export type SalesFilterParams = {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
};

// Estados iniciais
export const initialAuthState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

export const initialProfileState: UserProfileState = {
  profile: null,
  status: 'idle',
  error: null,
};

export const initialAddressesState: AddressesState = {
  addresses: [],
  currentAddress: null,
  status: 'idle',
  error: null,
};

export const initialSalesState: SalesState = {
  sales: {
    data: [],
    meta: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
  },
  purchases: {
    data: [],
    meta: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
  },
  status: 'idle',
  error: null,
};

export const initialStatsState: StatsState = {
  stats: null,
  status: 'idle',
  error: null,
};

// Tipos para operações do usuário
export interface UserOperations {
  // Autenticação
  signIn: (credentials: LoginPayload) => Promise<User>;
  signUp: (userData: RegisterPayload) => Promise<User>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
  
  // Perfil
  getProfile: () => Promise<UserProfileState['profile']>;
  updateProfile: (data: UpdateProfilePayload) => Promise<User>;
  deleteAccount: () => Promise<void>;
  
  // Endereços
  getAddresses: () => Promise<Endereco[]>;
  addAddress: (addressData: CreateAddressPayload) => Promise<Endereco>;
  updateAddress: (addressId: string, addressData: UpdateAddressPayload) => Promise<Endereco>;
  removeAddress: (addressId: string) => Promise<void>;
  
  // Vendas/Compras
  getSales: () => Promise<PaginatedResponse<Venda>>;
  getPurchases: () => Promise<PaginatedResponse<Venda>>;
  
  // Estatísticas
  getStats: () => Promise<UserStats>;
}

// Tipo para o hook useUser
export type UseUserHook = UserOperations & {
  // Estado
  auth: AuthState;
  profile: UserProfileState['profile'];
  addresses: Endereco[];
  sales: SalesState['sales'];
  purchases: SalesState['purchases'];
  stats: UserStats | null;
  isAuthenticated: boolean;
};