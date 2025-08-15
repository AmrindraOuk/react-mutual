import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { quotesService } from "../services/quotesService";

const initialState = {
  quotes: [],
  currentQuote: null,
  loading: false,
  error: null,
  searchFilters: {
    type: "",
    status: "",
    dateRange: null,
  },
};

export const fetchQuotes = createAsyncThunk(
  "quotes/fetchQuotes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await quotesService.getQuotes();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createQuote = createAsyncThunk(
  "quotes/createQuote",
  async (quoteData, { rejectWithValue }) => {
    try {
      const response = await quotesService.createQuote(quoteData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuote = createAsyncThunk(
  "quotes/updateQuote",
  async ({ id, quoteData }, { rejectWithValue }) => {
    try {
      const response = await quotesService.updateQuote(id, quoteData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteQuote = createAsyncThunk(
  "quotes/deleteQuote",
  async (id, { rejectWithValue }) => {
    try {
      await quotesService.deleteQuote(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const quotesSlice = createSlice({
  name: "quotes",
  initialState,
  reducers: {
    setCurrentQuote: (state, action) => {
      state.currentQuote = action.payload;
    },
    clearCurrentQuote: (state) => {
      state.currentQuote = null;
    },
    setSearchFilters: (state, action) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch quotes
      .addCase(fetchQuotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotes.fulfilled, (state, action) => {
        state.loading = false;
        state.quotes = action.payload;
      })
      .addCase(fetchQuotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create quote
      .addCase(createQuote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuote.fulfilled, (state, action) => {
        state.loading = false;
        state.quotes.push(action.payload);
        state.currentQuote = action.payload;
      })
      .addCase(createQuote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update quote
      .addCase(updateQuote.fulfilled, (state, action) => {
        const index = state.quotes.findIndex(
          (quote) => quote.id === action.payload.id
        );
        if (index !== -1) {
          state.quotes[index] = action.payload;
        }
        state.currentQuote = action.payload;
      })
      // Delete quote
      .addCase(deleteQuote.fulfilled, (state, action) => {
        state.quotes = state.quotes.filter(
          (quote) => quote.id !== action.payload
        );
      });
  },
});

export const {
  setCurrentQuote,
  clearCurrentQuote,
  setSearchFilters,
  clearError,
} = quotesSlice.actions;
export default quotesSlice.reducer;
