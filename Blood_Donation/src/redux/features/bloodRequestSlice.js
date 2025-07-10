import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../configs/axios";
import { toast } from "react-toastify";

export const createBloodRequest = createAsyncThunk(
  "bloodRequest/create",
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await api.post("/requests/medical", requestData);
      toast.success("Tạo yêu cầu nhận máu thành công!");
      return response.data;
    } catch (err) {
      toast.error("Tạo yêu cầu nhận máu thất bại!");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchRequestsByMedId = createAsyncThunk(
  "bloodRequest/fetchByMedId",
  async (medId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/requests/medical/${medId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteRequest = createAsyncThunk(
  "bloodRequest/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/requests/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchAllBloodRequests = createAsyncThunk(
  "bloodRequest/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/requests");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const bloodRequestSlice = createSlice({
  name: "bloodRequest",
  initialState: {
    requestList: [],
    loading: false,
    error: null,

    // For response when submitting
    createdRequest: null,
    createLoading: false,
    createError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequestsByMedId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequestsByMedId.fulfilled, (state, action) => {
        state.loading = false;
        state.requestList = action.payload;
      })
      .addCase(fetchRequestsByMedId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

        .addCase(fetchAllBloodRequests.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAllBloodRequests.fulfilled, (state, action) => {
            state.loading = false;
            state.requestList = action.payload;
        })
        .addCase(fetchAllBloodRequests.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        })

      .addCase(createBloodRequest.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createBloodRequest.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createdRequest = action.payload;
        state.requestList.push(action.payload);
      })
      .addCase(createBloodRequest.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || action.error.message;
      });
  },
});

export default bloodRequestSlice.reducer;