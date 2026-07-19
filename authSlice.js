import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    role: null,
    firebaseUser: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.firebaseUser = action.payload.firebaseUser;
      state.role = action.payload.user.role;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.firebaseUser = null;
      state.role = null;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, loginSuccess, loginFailure, logout, setUser, setAuthError } = authSlice.actions;
export default authSlice.reducer;
