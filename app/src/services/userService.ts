import api from "./api";
import type { UserStats } from "../store/user/types";
import type { User, Endereco, Venda, PaginatedResponse } from "../types/types";
import type { LoginPayload } from "../store/user/types";

// Tipos para melhor organização
type RegisterData = {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cpf?: string;
  dataNascimento?: string;
};

type UpdateProfileData = Partial<{
  nome: string;
  telefone: string;
  avatar: string;
}>;

type AddressData = Omit<Endereco, "id" | "userId">;

// Serviços de Autenticação


export const authService = {
  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post("/usuarios/register", data);
    return response.data.user; // Assume que o cookie é setado automaticamente
  },

  login: async (credentials: LoginPayload): Promise<User> => {
    const response = await api.post("/usuarios/login", credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/usuarios/logout");
  },

  checkSession: async (): Promise<User> => {
    const response = await api.get("/usuarios/me");
    return response.data;
  }
};


// Serviços de Perfil


export const profileService = {
  getCurrentUser: async (): Promise<User & {
    enderecos: Endereco[];
    vendasComoVendedor: Venda[];
    vendasComoComprador: Venda[];
  }> => {
    const response = await api.get("/usuarios/me");
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const response = await api.put("/usuarios/me", data);
    return response.data;
  },

  deleteAccount: async (): Promise<void> => {
    await api.delete("/usuarios/me");
  },
};


// Serviços de Vendas/Compras

export const saleService = {
  getMySales: async (): Promise<PaginatedResponse<Venda>> => {
    const response = await api.get('/sales/me');
    return response.data;
  },

  getMyPurchases: async (): Promise<PaginatedResponse<Venda>> => {
    const response = await api.get('/purchases/me');
    return response.data;
  }
};

export const statsService = {
  getMyStats: async (): Promise<UserStats> => {
    const response = await api.get('/stats/me');
    return response.data;
  }
};

// Serviços de Endereço

export const addressService = {
  getMyAddresses: async (): Promise<Endereco[]> => {
    const response = await api.get("/usuarios/me/enderecos");
    return response.data;
  },

  createAddress: async (addressData: AddressData): Promise<Endereco> => {
    const response = await api.post("/usuarios/me/enderecos", addressData);
    return response.data;
  },

  updateAddress: async (addressId: string, addressData: Partial<AddressData>): Promise<Endereco> => {
    const response = await api.put(`/usuarios/me/enderecos/${addressId}`, addressData);
    return response.data;
  },

  deleteAddress: async (addressId: string): Promise<void> => {
    await api.delete(`/usuarios/me/enderecos/${addressId}`);
  }
};
