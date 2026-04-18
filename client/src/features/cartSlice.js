import { createSlice } from '@reduxjs/toolkit';

const cartFromStorage = localStorage.getItem('cartItems');

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: cartFromStorage ? JSON.parse(cartFromStorage) : [],
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const exists = state.items.find((x) => x.product === item.product);
      if (exists) {
        state.items = state.items.map((x) => (x.product === exists.product ? item : x));
      } else {
        state.items.push(item);
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((x) => x.product !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cartItems');
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
