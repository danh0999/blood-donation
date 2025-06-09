// features/bloodHistorySlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  donationHistory: [],
  receiveHistory: [],
  loading: false,
  error: null,
};

const bloodHistorySlice = createSlice({
  name: "bloodHistory",
  initialState,
  reducers: {
    setDonationHistory(state, action) {
      state.donationHistory = action.payload;
    },
    setReceiveHistory(state, action) {
      state.receiveHistory = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearHistory(state) {
      state.donationHistory = [];
      state.receiveHistory = [];
    },
  },
});

export const {
  setDonationHistory,
  setReceiveHistory,
  setLoading,
  setError,
  clearHistory,
} = bloodHistorySlice.actions;

export default bloodHistorySlice.reducer;
