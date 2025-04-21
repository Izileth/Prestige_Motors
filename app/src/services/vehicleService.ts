import api from "./api";
import type {
    User,
    Vehicle,
    Avaliacao,
    PaginatedResponse,
    Combustivel,
    Cambio,
    Carroceria,
    Categoria,
    Classe,
    StatusVeiculo
} from "../types/types";

export const vehicleService = {
    // Criação e Listagem
    createVehicle: async (data: Omit<Vehicle, 'id' | 'imagens' | 'videos' | 'status'>): Promise<Vehicle> => {
        const response = await api.post("/veiculos", data);
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
        const response = await api.get("/veiculos", { params: filters });
        return response.data;
    },

    // Detalhes e Atualização
    getVehicleDetails: async (id: string): Promise<Vehicle & {
        vendedor: Pick<User, "id" | "nome" | "telefone" | "avatar">;
        avaliacoes: Avaliacao[];
    }> => {
        const response = await api.get(`/veiculos/${id}`);
        return response.data;
    },

    updateVehicle: async (id: string, data: Partial<Vehicle>): Promise<Vehicle> => {
        const response = await api.put(`/veiculos/${id}`, data);
        return response.data;
    },

    updateVehicleStatus: async (id: string, status: StatusVeiculo): Promise<Vehicle> => {
        const response = await api.put(`/veiculos/${id}/status`, { status });
        return response.data;
    },

    deleteVehicle: async (id: string): Promise<void> => {
        await api.delete(`/veiculos/${id}`);
    },

    // Mídia
    uploadImages: async (vehicleId: string, images: File[]): Promise<{ urls: string[] }> => {
        const formData = new FormData();
        images.forEach((image) => formData.append("images", image));
        const response = await api.post(`/veiculos/${vehicleId}/images`, formData);
        return response.data;
    },

    uploadVideo: async (vehicleId: string, video: File): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append("video", video);
        const response = await api.post(`/veiculos/${vehicleId}/video`, formData);
        return response.data;
    },

    // Interações
    registerView: async (vehicleId: string): Promise<void> => {
        await api.post(`/veiculos/${vehicleId}/visualizacao`);
    },

    toggleFavorite: async (vehicleId: string): Promise<{ favorited: boolean }> => {
        const response = await api.post(`/veiculos/${vehicleId}/favorito`);
        return response.data;
    },

    getFavorites: async (): Promise<PaginatedResponse<Vehicle>> => {
        const response = await api.get("/veiculos/meus/favoritos");
        return response.data;
    },

    // Avaliações
    createReview: async (vehicleId: string, data: { 
        rating: number; 
        comentario?: string 
    }): Promise<Avaliacao> => {
        const response = await api.post(`/veiculos/${vehicleId}/avaliar`, data);
        return response.data;
    },

    getReviews: async (vehicleId: string): Promise<PaginatedResponse<Avaliacao>> => {
        const response = await api.get(`/veiculos/${vehicleId}/avaliacoes`);
        return response.data;
    },

    // Vendedor
    getVendorVehicles: async (vendorId: string): Promise<PaginatedResponse<Vehicle>> => {
        const response = await api.get(`/veiculos/vendedor/${vendorId}`);
        return response.data;
    },

    getUserVehicles: async (): Promise<PaginatedResponse<Vehicle>> => {
        const response = await api.get("/veiculos/meus/veiculos");
        return response.data;
    },

    // Estatísticas
    getVehicleStats: async (): Promise<{
        totalVehicles: number;
        averagePrice: number;
        byFuelType: Record<Combustivel, number>;
    }> => {
        const response = await api.get("/veiculos/stats");
        return response.data;
    },

    getUserVehicleStats: async (): Promise<{
        totalViews: number;
        favoritesCount: number;
        averageRating: number;
    }> => {
        const response = await api.get("/veiculos/meus/stats");
        return response.data;
    }
};