import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import quotesSlice from "./quotesSlice";
import policiesSlice from "./policiesSlice";
import claimsSlice from "./claimsSlice";
import paymentsSlice from "./paymentsSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    quotes: quotesSlice,
    policies: policiesSlice,
    claims: claimsSlice,
    payments: paymentsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export default store;
