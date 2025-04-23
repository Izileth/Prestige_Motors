import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './types';
import type { SalesState} from './types';
import type { Venda, PaginatedResponse } from '~/src/types/types';
import { 
  createNewSale, 
  fetchSaleDetails, 
  fetchVehicleSales, 
  updateSale,
  fetchAllSales,
  fetchSellerSales,
  fetchBuyerPurchases
} from './saleThuncks';

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    clearCurrentSale(state) {
      state.currentSale = null;
    },
    resetSalesState: () => initialState,
    setSalesPage(state, action: PayloadAction<number>) {
      state.sales.meta.currentPage = action.payload;
    },
    setVehicleSalesPage(state, action: PayloadAction<{vehicleId: string, page: number}>) {
      if (state.vehicleSales[action.payload.vehicleId]) {
        state.vehicleSales[action.payload.vehicleId].meta.currentPage = action.payload.page;
      }
    },
    // Adicione redutores similares para sellerSales e buyerPurchases se necessário
  },
  extraReducers: (builder) => {
    builder
      // Criação de venda
      .addCase(createNewSale.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createNewSale.fulfilled, (state, action: PayloadAction<Venda>) => {
        state.status = 'succeeded';
        state.sales.data.unshift(action.payload);
        state.sales.meta.totalItems += 1;
        state.currentSale = action.payload;
      })
      .addCase(createNewSale.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Busca de vendas paginadas
      .addCase(fetchAllSales.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllSales.fulfilled, (state, action: PayloadAction<PaginatedResponse<Venda>>) => {
        state.status = 'succeeded';
        state.sales = action.payload;
      })
      .addCase(fetchAllSales.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Detalhes da venda
      .addCase(fetchSaleDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSaleDetails.fulfilled, (state, action: PayloadAction<Venda>) => {
        state.status = 'succeeded';
        state.currentSale = action.payload;
      })
      .addCase(fetchSaleDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Vendas por veículo
      .addCase(fetchVehicleSales.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchVehicleSales.fulfilled, (state, action: PayloadAction<PaginatedResponse<Venda>>) => {
        state.status = 'succeeded';
        const vehicleId = action.type; // Assumindo que o vehicleId é passado como argumento
        state.vehicleSales[vehicleId] = action.payload;
      })

      .addCase(fetchVehicleSales.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Vendas por vendedor
      .addCase(fetchSellerSales.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSellerSales.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { userId, data } = action.payload;
        state.sellerSales[userId] = data;
      })
      .addCase(fetchSellerSales.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Compras por comprador
      .addCase(fetchBuyerPurchases.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(fetchBuyerPurchases.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const buyerId = action.meta.arg; 
        state.buyerPurchases[buyerId] = action.payload;
      })
      .addCase(fetchBuyerPurchases.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Atualização de venda
      .addCase(updateSale.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateSale.fulfilled, (state, action: PayloadAction<Venda>) => {
        state.status = 'succeeded';
        state.currentSale = action.payload;
        
        // Atualiza em todas as listas relevantes
        const updateInPaginatedResponse = (response: PaginatedResponse<Venda>) => ({
          ...response,
          data: response.data.map(sale => 
            sale.id === action.payload.id ? action.payload : sale
          )
        });

        // Atualiza na lista geral
        state.sales = updateInPaginatedResponse(state.sales);
        
        // Atualiza nas listas de veículos
        for (const vehicleId in state.vehicleSales) {
          state.vehicleSales[vehicleId] = updateInPaginatedResponse(state.vehicleSales[vehicleId]);
        }
        
        // Atualiza nas listas de vendedores
        for (const sellerId in state.sellerSales) {
          state.sellerSales[sellerId] = updateInPaginatedResponse(state.sellerSales[sellerId]);
        }
        
        // Atualiza nas listas de compradores
        for (const buyerId in state.buyerPurchases) {
          state.buyerPurchases[buyerId] = updateInPaginatedResponse(state.buyerPurchases[buyerId]);
        }
      })
      .addCase(updateSale.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearCurrentSale, 
  resetSalesState,
  setSalesPage,
  setVehicleSalesPage
} = salesSlice.actions;

export default salesSlice.reducer;