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

// Async thunk to create new address 
export const createAddress = createAsyncThunk(
  "addresses/createAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/addresses`, addressData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
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
      // fetchAddresses
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

      // fetchAddressByID
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
      })

      // createAddress
      .addCase(createAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default addressSlice.reducer;
