import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import applicationReducer from "./features/applicationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    application: applicationReducer,
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
