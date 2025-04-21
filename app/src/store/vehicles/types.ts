import type { 
  Vehicle, 
  PaginatedResponse, 
  Combustivel, 
  Cambio, 
  Carroceria, 
  Categoria, 
  Classe, 
  StatusVeiculo,
  Avaliacao
} from '../../types/types';

export interface VehiclesState {
  vehicles: Vehicle[];
  featuredVehicles: Vehicle[];
  userVehicles: Vehicle[];
  vendorVehicles: Vehicle[];  // Adicionado
  favorites: {  // Modificado para objeto paginado
    data: Vehicle[];
    meta: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    }
  };
  reviews: {  // Adicionado
    data: Avaliacao[];
    meta: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    }
  };
  currentVehicle: Vehicle | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
  filters: Partial<VehicleFilters>;  // Modificado para usar VehicleFilters
  stats: VehicleStats | null;  // Adicionado
  userStats: UserVehicleStats | null;  // Adicionado
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  uploadStatus: 'idle' | 'loading' | 'succeeded' | 'failed';  // Adicionado
  error: string | null;
}

export interface VehicleFilters {
  marca?: string;
  modelo?: string;
  precoMin?: number;
  precoMax?: number;
  anoFabricacaoMin?: number;
  anoFabricacaoMax?: number;
  tipoCombustivel?: Combustivel;
  cambio?: Cambio;
  carroceria?: Carroceria;
  categoria?: Categoria;
  classe?: Classe;
  page?: number;
  limit?: number;
  status?: StatusVeiculo;
  vendedorId?: string;
}

export interface VehicleStats {
  totalVehicles: number;
  averagePrice: number;
  byFuelType: Record<Combustivel, number>;
  byCategory: Record<Categoria, number>;
}

export interface UserVehicleStats {
  totalViews: number;
  favoritesCount: number;
  averageRating: number;
  totalVehicles: number;
}