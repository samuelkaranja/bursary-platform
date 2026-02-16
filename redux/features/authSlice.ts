import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "../api";

type UserRole = "applicant" | "admin" | string;

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  role: UserRole | null;
  hydrated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  role: null,
  hydrated: false,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    { phone, password }: { phone: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ phone, password }),
      });

      return data; // expect: { access_token, role, ... }
    } catch (error: any) {
      if (error.message === "Applicant already exists") {
        try {
          const loginData = await apiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({ phone, password }),
          });

          return loginData; // expect: { access_token, role, ... }
        } catch (loginError: any) {
          return rejectWithValue(loginError.message);
        }
      }

      return rejectWithValue(error.message);
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { phone, password }: { phone: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ phone, password }),
      });

      return data; // expect: { access_token, role, ... }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.role = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    hydrateAuth(state) {
      // Optional helper if you want to hydrate on app load
      const token = localStorage.getItem("token");
      const userRaw = localStorage.getItem("user");

      if (token) {
        state.accessToken = token;
        state.isAuthenticated = true;
      }
      if (userRaw) {
        try {
          const user = JSON.parse(userRaw);
          state.role = user?.role ?? null;
        } catch {}
      }

      state.hydrated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.access_token;
        state.isAuthenticated = true;
        state.role = action.payload.role ?? null;

        localStorage.setItem("token", action.payload.access_token);
        localStorage.setItem(
          "user",
          JSON.stringify({ role: action.payload.role ?? null }),
        );
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = false;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.access_token;
        state.isAuthenticated = true;
        state.role = action.payload.role ?? null;

        localStorage.setItem("token", action.payload.access_token);
        localStorage.setItem(
          "user",
          JSON.stringify({ role: action.payload.role ?? null }),
        );
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logout, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
