import api from "./api";
import type { Venda, PaginatedResponse } from "../types/types";

export const createSale = async (data: {
    vehicleId: string;
    compradorId: string;
    precoVenda: number;
    formaPagamento: string;
    parcelas?: number;
}): Promise<Venda> => {
    const response = await api.post("/vendas", data);
    return response.data;
};

export const getSaleDetails = async (saleId: string): Promise<Venda> => {
    const response = await api.get(`/vendas/${saleId}`);
    return response.data;
};


export const getSalesByVehicle = async (
    vehicleId: string,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Venda>> => {
    const response = await api.get(`/vendas/veiculo/${vehicleId}`, { params });
    return response.data;
  };
  
export const updateSaleStatus = async (
    saleId: string,
    data: { status: string }
): Promise<Venda> => {
    const response = await api.put(`/vendas/${saleId}`, data);
    return response.data;
};

export const getSales = async (
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Venda>> => {
    const response = await api.get('/vendas', { params });
    return response.data;
  };