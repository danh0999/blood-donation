import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  history: [],
};

const bloodHistorySlice = createSlice({
  name: "bloodHistory",
  initialState,
  reducers: {
    setDonationHistory: (state, action) => {
      state.history = action.payload;
    },
    clearDonationHistory: (state) => {
      state.history = []; // ✅ Phải có dòng này
    },
  },
});

export const { setDonationHistory, clearDonationHistory } =
  bloodHistorySlice.actions;
export default bloodHistorySlice.reducer;
