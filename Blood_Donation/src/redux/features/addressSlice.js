  import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../configs/axios";

// Async thunk to fetch all addresses
export const fetchAddresses = createAsyncThunk(
  "addresses/fetchAddresses",
  async () => {
    const response = await api.get("/addresses");
    return response.data;
  }
);

// Async thunk to fetch a single address by ID
export const fetchAddressById = createAsyncThunk(
  "addresses/fetchAddressById",
  async (id) => {
    const response = await api.get(`/addresses/${id}`);
    return response.data;
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    data: [],
    loading: false,
    error: null,
    selectedAddress: null,
    selectedLoading: false,
    selectedError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAddressById.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = null;
        state.selectedAddress = null;
      })
      .addCase(fetchAddressById.fulfilled, (state, action) => {
        state.selectedLoading = false;
        state.selectedAddress = action.payload;
      })
      .addCase(fetchAddressById.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError = action.error.message;
        state.selectedAddress = null;
      });
  },
});

export default addressSlice.reducer;
