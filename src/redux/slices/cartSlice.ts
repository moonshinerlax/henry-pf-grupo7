import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';

interface CartItem {
    id: string;
    image: string;
    price: number;
    qty: number;
}

interface CartState {
    loading: boolean;
    cartItems: CartItem[];
    itemsPrice: string; 
    shippingPrice: string;
    taxPrice: string;
    totalPrice: string;
}

const initialState: CartState = {
    loading: true,
    cartItems: [],
    itemsPrice: '0.00',
    shippingPrice: '0.00',
    taxPrice: '0.00',
    totalPrice: '0.00',
};

const addDecimals = (num: number): string => {
    return (Math.round(num * 100) / 100).toFixed(2);
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x.id === item.id);
            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x.id === existItem.id ? item : x
                );
            } else {
                state.cartItems = [...state.cartItems, item];
            }
            state.itemsPrice = addDecimals(
                state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
            );
            state.shippingPrice = addDecimals(Number(state.itemsPrice) > 100 ? 0 : 100);
            state.taxPrice = addDecimals(
                Number((0.15 * parseFloat(state.itemsPrice)))
            );
            state.totalPrice = (
                Number(state.itemsPrice) +
                Number(state.shippingPrice) +
                Number(state.taxPrice)
            ).toString();
            Cookies.set('cart', JSON.stringify(state));
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.cartItems = state.cartItems.filter((x) => x.id !== action.payload);
            state.itemsPrice = addDecimals(
                state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
            );
            state.shippingPrice = addDecimals(Number(state.itemsPrice) > 100 ? 0 : 100);
            state.taxPrice = addDecimals(
                Number((0.15 * parseFloat(state.itemsPrice)))
            );
            state.totalPrice = (
                Number(state.itemsPrice) +
                Number(state.shippingPrice) +
                Number(state.taxPrice)
            ).toString();
            Cookies.set('cart', JSON.stringify(state));
        },
        hideLoading: (state) => {
            state.loading = false;
        },
    },
});

export const { addToCart, removeFromCart, hideLoading } = cartSlice.actions;

export const cartReducer = cartSlice.reducer;