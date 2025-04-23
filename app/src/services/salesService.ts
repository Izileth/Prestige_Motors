import api from "./api";
import type { Venda, PaginatedResponse } from "../types/types";

export type SaleStatus = "pending" | "completed" | "canceled";
export type PaymentMethod = "credit" | "debit" | "transfer" | "cash";

export interface SaleCreatePayload {
    vehicle_id: string;
    buyer_id: string;
    sale_price: number;
    payment_method: PaymentMethod;
    installments?: number;
}

export const saleService = {

    createSale: async (data: SaleCreatePayload): Promise<Venda> => {
        const response = await api.post("/sales", data);
        return response.data;
    },

    getSaleById: async (saleId: string): Promise<Venda> => {
        const response = await api.get(`/sales/${saleId}`);
        return response.data;
    },

    getSaleByVehicle: async (
        vehicleId: string,
        params?: { page?: number; limit?: number }
    ): Promise<PaginatedResponse<Venda>> => {
        const response = await api.get(`/sales/vehicles/${vehicleId}`, { params });
        return response.data;
    },

    getSalesBySeller: async (userId: string): Promise<PaginatedResponse<Venda>> => {
      const response = await api.get(`/sales/sellers/${userId}`);
      return response.data;
    },

    getPurchasesByBuyer: async (userId: string): Promise<PaginatedResponse<Venda>> => {
      const response = await api.get(`/sales/buyers/${userId}`);
      return response.data;
    } ,

    updateSaleStatus: async (
        saleId: string,
        status: SaleStatus
    ): Promise<Venda> => {
        const response = await api.put(`/sales/${saleId}`, { status });
        return response.data;
    },

    getSaleAll: async (
        params?: { page?: number; limit?: number }
    ): Promise<PaginatedResponse<Venda>> => {
        const response = await api.get('/sales', { params });
        return response.data;
    }
};