import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { apiFetch } from "../api";

type LabeledValue = { label: string; value: number };
type TopSchool = { school: string; applications: number };

export type AdminOverviewResponse = {
  total_applications: number;
  pending: number;
  approved: number;
  rejected: number;
  applications_by_status: LabeledValue[];
  applications_by_education_level: LabeledValue[];
  top_schools: TopSchool[];
};

type AdminState = {
  overview: AdminOverviewResponse | null;
  loading: boolean;
  error: string | null;
};

const initialState: AdminState = {
  overview: null,
  loading: false,
  error: null,
};

export const fetchAdminOverview = createAsyncThunk(
  "admin/fetchOverview",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;
    const role = String(state.auth.role ?? "").toLowerCase().trim();

    if (role !== "admin") return rejectWithValue("Forbidden: admin only");

    try {
      return await apiFetch("/admin/overview", {}, token!);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdmin(state) {
      state.overview = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchAdminOverview.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load overview";
      });
  },
});

export const { clearAdmin } = adminSlice.actions;
export default adminSlice.reducer;
