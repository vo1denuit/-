import { configureStore } from '@reduxjs/toolkit';
import particleAmountReducer from './slices/particle-amount-slice.ts';
import particleContentReducer from './slices/particle-content-slice.ts';

export const store = configureStore({
    reducer: {
        particleAmount: particleAmountReducer,
        particleContent: particleContentReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;