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

// Async thunk to fetch a specific account by ID
export const fetchAccountById = createAsyncThunk(
  "accounts/fetchAccountById",
  async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  }
);

const accountSlice = createSlice({
  name: "account", // name of the slice state, put this name in the rootReducer, before the ":"
  initialState: {
    // state for account list
    data: [],
    loading: false,
    error: null,

    // state for a specific account object
    selectedAccount: null,
    selectedLoading: false,
    selectedError: null,
  },
  reducers: {},

  // reducers used by Async thunk
  extraReducers: (builder) => {
    builder
      // fetchAccounts
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
      })
      
      // fetchAccountById
      .addCase(fetchAccountById.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = null;
        state.selectedAccount = null;
      })
      .addCase(fetchAccountById.fulfilled, (state, action) => {
        state.selectedLoading = false;
        state.selectedAccount = action.payload;
      })
      .addCase(fetchAccountById.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError = action.error.message;
        state.selectedAccount = null;
      });
  },
});

export default accountSlice.reducer;