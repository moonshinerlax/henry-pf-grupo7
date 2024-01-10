import { configureStore } from "@reduxjs/toolkit";
import {cartReducer, cartSlice} from "./slices/cartSlice";

type CartState = ReturnType<typeof cartSlice.reducer>

export type RootState = {
    cart: CartState
    
}

export const store = configureStore({
    reducer: {
        cart: cartReducer,
    },
    devTools: process.env.NODE_ENV !== 'production'
})