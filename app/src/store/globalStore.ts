import React from 'react'; 
import { configureStore } from '@reduxjs/toolkit';
import {
  authReducer,
  profileReducer,
  addressesReducer,
  salesReducer as userSalesReducer,
  statsReducer
} from './user/userSlice';
import salesReducer from './sales/saleSlice';
import reviewsReducer from './sales/saleSlice';
import vehiclesReducer from './vehicles/vehicleSlice';

export const store = configureStore({
    reducer: {
    // Módulo de autenticação
    auth: authReducer,
    
    // Módulo do usuário
    userProfile: profileReducer,       // Perfil completo do usuário
    userAddresses: addressesReducer,  // Endereços do usuário
    userSales: userSalesReducer,   
    userStats: statsReducer, // ← Adicione esta linha   // Vendas do usuário (como vendedor/comprador)
    
    // Módulo de veículos
    vehicles: vehiclesReducer,        // Veículos (listagem, detalhes, etc.)
    
    // Módulo de vendas
    sales: salesReducer,              // Vendas (geral)
    
    // Módulo de avaliações
    reviews: reviewsReducer,          // Avaliações de veículos
    
    // Outros módulos podem ser adicionados aqui
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: {
            // Ignora ações específicas que podem conter dados não serializáveis
            ignoredActions: [
            'vehicles/uploadImages', 
            'user/updateProfile/fulfilled'
            ],
            // Ignora caminhos específicos no estado que podem conter dados não serializáveis
            ignoredPaths: [
            'vehicles.currentVehicle.imagens',
            'userProfile.profile.avatar',
            'auth.user.avatar'
            ],
            serializableCheck: false,
        }
    }),
  devTools: process.env.NODE_ENV !== 'production' // Habilita Redux DevTools apenas em desenvolvimento
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;