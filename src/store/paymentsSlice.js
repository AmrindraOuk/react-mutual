import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { paymentsService } from "../services/paymentsService";

const initialState = {
  payments: [],
  upcomingPayments: [],
  loading: false,
  error: null,
  stats: {
    totalPaid: 0,
    pending: 0,
    overdue: 0,
  },
};

export const fetchPayments = createAsyncThunk(
  "payments/fetchPayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentsService.getPayments();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const makePayment = createAsyncThunk(
  "payments/makePayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await paymentsService.makePayment(paymentData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUpcomingPayments = createAsyncThunk(
  "payments/fetchUpcomingPayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentsService.getUpcomingPayments();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    updateStats: (state) => {
      const stats = { totalPaid: 0, pending: 0, overdue: 0 };
      const now = new Date();

      state.payments.forEach((payment) => {
        if (payment.status === "completed") {
          stats.totalPaid += payment.amount;
        } else if (payment.status === "pending") {
          stats.pending += payment.amount;
          if (new Date(payment.dueDate) < now) {
            stats.overdue += payment.amount;
          }
        }
      });
      state.stats = stats;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch payments
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Make payment
      .addCase(makePayment.fulfilled, (state, action) => {
        state.payments.push(action.payload);
      })
      // Fetch upcoming payments
      .addCase(fetchUpcomingPayments.fulfilled, (state, action) => {
        state.upcomingPayments = action.payload;
      });
  },
});

export const { updateStats, clearError } = paymentsSlice.actions;
export default paymentsSlice.reducer;
