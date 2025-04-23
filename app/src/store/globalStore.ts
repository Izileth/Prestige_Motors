import React from 'react'; 
import { configureStore } from '@reduxjs/toolkit';
import salesReducer from './sales/saleSlice';
import reviewsReducer from './sales/saleSlice';
import { userReducer } from './user/userSlice';
import vehiclesReducer from './vehicles/vehicleSlice';


export const store = configureStore({
  reducer: {
    user: userReducer,       // Todos os dados do usuário consolidados
    vehicles: vehiclesReducer,
    sales: salesReducer,
    reviews: reviewsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'vehicles/uploadImages', 
          'user/updateProfile/fulfilled'
        ],
        ignoredPaths: [
          'user.auth.user',
          'vehicles.currentVehicle.imagens'
        ]
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;