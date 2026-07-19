import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    selectedOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setOrders: (state, action) => {
      state.items = action.payload;
      state.loading = false;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    updateOrderStatus: (state, action) => {
      const order = state.items.find(o => o._id === action.payload.orderId);
      if (order) order.status = action.payload.status;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoading, setOrders, setSelectedOrder, updateOrderStatus, setError } = orderSlice.actions;
export default orderSlice.reducer;
