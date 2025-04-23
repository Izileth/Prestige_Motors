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
    const response = await api.post("/users/register", data);
    return response.data.user; // Assume que o cookie é setado automaticamente
  },

  login: async (credentials: LoginPayload): Promise<User> => {
    const response = await api.post("/users/login", credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/usuarios/logout");
  },

  checkSession: async (): Promise<User> => {
    const response = await api.get("/users/check-session");
    return response.data.user; // Seu backend retorna { user } no objeto de resposta
  }
};


// Serviços de Perfil


export const profileService = {
  getCurrentUser: async (): Promise<User & {
    enderecos: Endereco[];
    vendasComoVendedor: Venda[];
    vendasComoComprador: Venda[];
  }> => {
    const response = await api.get("/users/me");
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const response = await api.put("/users/me", data);
    return response.data;
  },

  deleteAccount: async (): Promise<void> => {
    await api.delete("/users/me");
  },
};



export const statsService = {
  getUserStats: async (userId: string): Promise<UserStats> => {
    const response = await api.get(`/users/${userId}/stats`);
    return response.data;
  }
};

// Serviços de Endereço

export const addressService = {

  getMyAddresses: async (): Promise<Endereco[]> => {
    const response = await api.get("/users/me/addresses");
    return response.data;
  },

  createAddress: async (addressData: AddressData): Promise<Endereco> => {
    const response = await api.post("/users/me/addresses", addressData);
    return response.data;
  },

  updateAddress: async (addressId: string, addressData: Partial<AddressData>): Promise<Endereco> => {
    const response = await api.put(`/users/me/addresses/${addressId}`, addressData);
    return response.data;
  },

  deleteAddress: async (addressId: string): Promise<void> => {
    await api.delete(`/users/me/addresses/${addressId}`);
  }
};
