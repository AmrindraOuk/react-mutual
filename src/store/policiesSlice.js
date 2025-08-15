import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { policiesService } from "../services/policiesService";

const initialState = {
  policies: [],
  currentPolicy: null,
  loading: false,
  error: null,
  stats: {
    active: 0,
    pending: 0,
    expired: 0,
    cancelled: 0,
  },
};

export const fetchPolicies = createAsyncThunk(
  "policies/fetchPolicies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await policiesService.getPolicies();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPolicy = createAsyncThunk(
  "policies/createPolicy",
  async (policyData, { rejectWithValue }) => {
    try {
      const response = await policiesService.createPolicy(policyData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const renewPolicy = createAsyncThunk(
  "policies/renewPolicy",
  async (policyId, { rejectWithValue }) => {
    try {
      const response = await policiesService.renewPolicy(policyId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelPolicy = createAsyncThunk(
  "policies/cancelPolicy",
  async (policyId, { rejectWithValue }) => {
    try {
      const response = await policiesService.cancelPolicy(policyId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const policiesSlice = createSlice({
  name: "policies",
  initialState,
  reducers: {
    setCurrentPolicy: (state, action) => {
      state.currentPolicy = action.payload;
    },
    clearCurrentPolicy: (state) => {
      state.currentPolicy = null;
    },
    updateStats: (state) => {
      const stats = { active: 0, pending: 0, expired: 0, cancelled: 0 };
      state.policies.forEach((policy) => {
        stats[policy.status] = (stats[policy.status] || 0) + 1;
      });
      state.stats = stats;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch policies
      .addCase(fetchPolicies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPolicies.fulfilled, (state, action) => {
        state.loading = false;
        state.policies = action.payload;
      })
      .addCase(fetchPolicies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create policy
      .addCase(createPolicy.fulfilled, (state, action) => {
        state.policies.push(action.payload);
      })
      // Renew policy
      .addCase(renewPolicy.fulfilled, (state, action) => {
        const index = state.policies.findIndex(
          (policy) => policy.id === action.payload.id
        );
        if (index !== -1) {
          state.policies[index] = action.payload;
        }
      })
      // Cancel policy
      .addCase(cancelPolicy.fulfilled, (state, action) => {
        const index = state.policies.findIndex(
          (policy) => policy.id === action.payload.id
        );
        if (index !== -1) {
          state.policies[index] = action.payload;
        }
      });
  },
});

export const { setCurrentPolicy, clearCurrentPolicy, updateStats, clearError } =
  policiesSlice.actions;
export default policiesSlice.reducer;
