import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  history: [],
  selectedProgram: null, // 🔹 thêm selectedProgram vào state
};

const bloodHistorySlice = createSlice({
  name: "bloodHistory",
  initialState,
  reducers: {
    setDonationHistory: (state, action) => {
      state.history = action.payload;
    },
    clearDonationHistory: () => {
      return initialState;
    },
    setSelectedProgram: (state, action) => {
      state.selectedProgram = action.payload; // 🔹 set program đã chọn
    },
    clearSelectedProgram: (state) => {
      state.selectedProgram = null; // 🔹 reset nếu cần
    },
  },
});

export const {
  setDonationHistory,
  clearDonationHistory,
  setSelectedProgram,
  clearSelectedProgram,
} = bloodHistorySlice.actions;

export default bloodHistorySlice.reducer;
