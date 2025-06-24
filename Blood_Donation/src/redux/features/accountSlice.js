import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../configs/axios";

// Async thunk to fetch accounts from the API
export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAccounts",
  async () => {
    const response = await api.get("/admin/users");
    // Add a 'key' property for AntD Table
    return response.data.map((user) => ({
      ...user,
      key: user.userID,
    }));
  }
);

const accountSlice = createSlice({
  name: "accounts", // put this name in the rootReducer, before the ":"
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},

  // reducers used by Async thunk
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default accountSlice.reducer;