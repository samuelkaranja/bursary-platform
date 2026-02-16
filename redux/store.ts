import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import applicationReducer from "./features/applicationSlice";
import adminReducer from "./features/adminSlice";
import adminApplicationsReducer from "./features/adminApplicationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    application: applicationReducer,
    admin: adminReducer,
    adminApplications: adminApplicationsReducer,
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
