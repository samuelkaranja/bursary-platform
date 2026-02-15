import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "../api";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  isAuthenticated: false,
  loading: false,
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

      return data;
    } catch (error: any) {
      // If already exists → login automatically
      if (error.message === "Applicant already exists") {
        try {
          const loginData = await apiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({ phone, password }),
          });

          return loginData;
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

      return data;
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

        localStorage.setItem("token", action.payload.access_token);
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

        localStorage.setItem("token", action.payload.access_token);
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
