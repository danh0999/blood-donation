import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../configs/axios";
import { toast } from "react-toastify";

// Fetch all appointments
export const fetchAllAppointments = createAsyncThunk(
  "donationForm/fetchAllAppointments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/appointments");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update appointment status
export const updateAppointmentStatus = createAsyncThunk(
  "donationForm/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      await api.patch(`/appointments/${id}/status`, null, {
        params: { status },
      });
      toast.success(`Cập nhật trạng thái thành công: ${status}`);
      return { id, status };
    } catch (err) {
      toast.error("Cập nhật trạng thái thất bại");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


const donationFormSlice = createSlice({
  name: "donationForm",
  initialState: {
    appointments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH all appointments
      .addCase(fetchAllAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAllAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // UPDATE appointment status
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const appointment = state.appointments.find((item) => item.id === id);
        if (appointment) {
          appointment.status = status;
        }
      });
  },
});

export default donationFormSlice.reducer;
