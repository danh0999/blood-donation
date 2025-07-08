import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  history: [],
  selectedProgram: null,
  currentAppointment: null, // ✅
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
      state.selectedProgram = action.payload;
    },
    clearSelectedProgram: (state) => {
      state.selectedProgram = null;
    },
    // ✅ Thêm 2 reducer dưới đây
    setCurrentAppointment: (state, action) => {
      state.currentAppointment = action.payload;
    },
    clearCurrentAppointment: (state) => {
      state.currentAppointment = null;
    },
  },
});

export const {
  setDonationHistory,
  clearDonationHistory,
  setSelectedProgram,
  clearSelectedProgram,
  setCurrentAppointment, // ✅ export
  clearCurrentAppointment, // ✅ export
} = bloodHistorySlice.actions;

export default bloodHistorySlice.reducer;
