import { createSlice } from '@reduxjs/toolkit';

const authFromStorage = localStorage.getItem('auth');
const initialAuth = authFromStorage ? JSON.parse(authFromStorage) : { token: null, user: null };

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: initialAuth.token,
    user: initialAuth.user,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('auth', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('auth');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
