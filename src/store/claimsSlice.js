import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { claimsService } from "../services/claimsService";

const initialState = {
  claims: [],
  currentClaim: null,
  loading: false,
  error: null,
  stats: {
    pending: 0,
    approved: 0,
    denied: 0,
    processing: 0,
  },
};

export const fetchClaims = createAsyncThunk(
  "claims/fetchClaims",
  async (_, { rejectWithValue }) => {
    try {
      const response = await claimsService.getClaims();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createClaim = createAsyncThunk(
  "claims/createClaim",
  async (claimData, { rejectWithValue }) => {
    try {
      const response = await claimsService.createClaim(claimData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateClaimStatus = createAsyncThunk(
  "claims/updateClaimStatus",
  async ({ claimId, status }, { rejectWithValue }) => {
    try {
      const response = await claimsService.updateClaimStatus(claimId, status);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addClaimMessage = createAsyncThunk(
  "claims/addClaimMessage",
  async ({ claimId, message }, { rejectWithValue }) => {
    try {
      const response = await claimsService.addMessage(claimId, message);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const claimsSlice = createSlice({
  name: "claims",
  initialState,
  reducers: {
    setCurrentClaim: (state, action) => {
      state.currentClaim = action.payload;
    },
    clearCurrentClaim: (state) => {
      state.currentClaim = null;
    },
    updateStats: (state) => {
      const stats = { pending: 0, approved: 0, denied: 0, processing: 0 };
      state.claims.forEach((claim) => {
        stats[claim.status] = (stats[claim.status] || 0) + 1;
      });
      state.stats = stats;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch claims
      .addCase(fetchClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.claims = action.payload;
      })
      .addCase(fetchClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create claim
      .addCase(createClaim.fulfilled, (state, action) => {
        state.claims.push(action.payload);
        state.currentClaim = action.payload;
      })
      // Update claim status
      .addCase(updateClaimStatus.fulfilled, (state, action) => {
        const index = state.claims.findIndex(
          (claim) => claim.id === action.payload.id
        );
        if (index !== -1) {
          state.claims[index] = action.payload;
        }
        if (state.currentClaim && state.currentClaim.id === action.payload.id) {
          state.currentClaim = action.payload;
        }
      })
      // Add claim message
      .addCase(addClaimMessage.fulfilled, (state, action) => {
        if (
          state.currentClaim &&
          state.currentClaim.id === action.payload.claimId
        ) {
          state.currentClaim.messages.push(action.payload.message);
        }
      });
  },
});

export const { setCurrentClaim, clearCurrentClaim, updateStats, clearError } =
  claimsSlice.actions;
export default claimsSlice.reducer;
