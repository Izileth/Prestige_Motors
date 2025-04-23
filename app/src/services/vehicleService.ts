import api from "./api";
import type {
    User,
    Vehicle,
    Avaliacao,
    PaginatedResponse,
    Combustivel,
    Cambio,
    Carroceria,

    StatusVeiculo
} from "../types/types";

export const vehicleService = {
    // Criação e Listagem
    createVehicle: async (data: Omit<Vehicle, 'id' | 'imagens' | 'videos' | 'status'>): Promise<Vehicle> => {
        const response = await api.post("/vehicles", data);
        return response.data;
    },

    getVehicles: async (filters?: {
        marca?: string;
        modelo?: string;
        precoMin?: number;
        precoMax?: number;
        anoFabricacaoMin?: number;
        anoFabricacaoMax?: number;
        tipoCombustivel?: Combustivel;
        cambio?: Cambio;
        carroceria?: Carroceria;
        page?: number;
        limit?: number;
    }): Promise<PaginatedResponse<Vehicle>> => {
        const response = await api.get("/vehicles", { params: filters });
        return response.data;
    },

    // Detalhes e Atualização
    getVehicleDetails: async (id: string): Promise<Vehicle & {
        vendedor: Pick<User, "id" | "nome" | "telefone" | "avatar">;
        avaliacoes: Avaliacao[];
    }> => {
        const response = await api.get(`/vehicles/${id}`);
        return response.data;
    },

    updateVehicle: async (id: string, data: Partial<Vehicle>): Promise<Vehicle> => {
        const response = await api.put(`/vehicles/${id}`, data);
        return response.data;
    },

    updateVehicleStatus: async (id: string, status: StatusVeiculo): Promise<Vehicle> => {
        const response = await api.put(`/vehicles/${id}/status`, { status });
        return response.data;
    },

    deleteVehicle: async (id: string): Promise<void> => {
        await api.delete(`/vehicles/${id}`);
    },

    // Mídia
    uploadImages: async (vehicleId: string, images: File[]): Promise<{ urls: string[] }> => {
        const formData = new FormData();
        images.forEach((image) => formData.append("images", image));
        const response = await api.post(`/vehicles/${vehicleId}/images`, formData);
        return response.data;
    },

    uploadVideos: async (vehicleId: string, video: File): Promise<{ urls: string[] }> => {
        const formData = new FormData();
        formData.append("video", video);
        const response = await api.post(`/vehicles/${vehicleId}/videos`, formData);
        return response.data;
    },

    // Interações
    registerView: async (vehicleId: string): Promise<void> => {
        await api.post(`/vehicles/${vehicleId}/views`);
    },
  
    toggleFavorite: async (vehicleId: string): Promise<{ favorited: boolean }> => {
        const response = await api.post(`/vehicles/${vehicleId}/favorites`);
        return response.data;
    },

    getFavorites: async (): Promise<PaginatedResponse<Vehicle>> => {
        const response = await api.get("/vehicles/me/favorites");
        return response.data;
    },

    // Avaliações
    createReview: async (vehicleId: string, data: { 
        rating: number; 
        comentario?: string 
    }): Promise<Avaliacao> => {
        const response = await api.post(`/vehicles/${vehicleId}/reviews`, data);
        return response.data;
    },

    getReviews: async (vehicleId: string): Promise<PaginatedResponse<Avaliacao>> => {
        const response = await api.get(`/vehicles/${vehicleId}/reviews`);
        return response.data;
    },


    getVendorVehicles: async (vendorId: string) => {
        const response = await api.get(`/vehicles/vendors/${vendorId}`);
        return response.data;
    },

    getUserVehicles: async (): Promise<PaginatedResponse<Vehicle>> => {
        const response = await api.get("/vehicles/me/vehicles");
        return response.data;
    },

    // Estatísticas
    getVehicleStats: async (): Promise<{
        totalVehicles: number;
        averagePrice: number;
        byFuelType: Record<Combustivel, number>;
    }> => {
        const response = await api.get("/vehicles/stats");
        return response.data;
    },

    getUserVehicleStats: async (): Promise<{
        totalViews: number;
        favoritesCount: number;
        averageRating: number;
    }> => {
        const response = await api.get("/vehicles/me/vehicle-stats");
        return response.data;
    }
};