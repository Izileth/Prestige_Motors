
import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './user';
import { salesReducer } from './sales/saleSlice';
import { vehicleReducer } from './vehicles/vehicleSlice';
export const store = configureStore({
  reducer: {
    // Todos os dados do usuário consolidados
    user: userReducer,
    vehicles: vehicleReducer,
    sales: salesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['vehicles/uploadImages', 'user/updateProfile/fulfilled'],
        ignoredPaths: ['user.auth.user', 'vehicles.currentVehicle.imagens']
      },
      immutableCheck: true // Adicione esta linha
    }),
  
  devTools: process.env.NODE_ENV !== 'production'
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

console.log('userReducer:', userReducer); // Deve mostrar uma função, nunca undefined