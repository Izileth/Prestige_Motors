import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { 
  initialState, 
} from './types';
import type { SalesState } from './types';
import type { Venda, PaginatedResponse } from '../../types/types';
import { 
  createNewSale, 
  fetchSaleDetails, 
  fetchVehicleSales, 
  updateSale,
  fetchSales
} from './saleThuncks'   


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
    setVehicleSalesPage(state, action: PayloadAction<number>) {
      state.vehicleSales.meta.currentPage = action.payload;
    }
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
      .addCase(fetchSales.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSales.fulfilled, (state, action: PayloadAction<PaginatedResponse<Venda>>) => {
        state.status = 'succeeded';
        state.sales = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
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

      // Vendas por veículo (paginadas)
      .addCase(fetchVehicleSales.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVehicleSales.fulfilled, (state, action: PayloadAction<PaginatedResponse<Venda>>) => {
        state.status = 'succeeded';
        state.vehicleSales = action.payload;
      })
      .addCase(fetchVehicleSales.rejected, (state, action) => {
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
        
        // Atualiza na lista geral
        state.sales.data = state.sales.data.map(sale => 
          sale.id === action.payload.id ? action.payload : sale
        );
        
        // Atualiza na lista de veículos
        state.vehicleSales.data = state.vehicleSales.data.map(sale =>
          sale.id === action.payload.id ? action.payload : sale
        );
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