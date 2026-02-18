import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { apiFetch } from "../api";

export type AdminApplicationItem = {
  id: number;
  applicant_name: string;
  school: string;
  level: "secondary" | "university";
  status:
    | "submitted"
    | "under_review"
    | "decision_pending"
    | "approved"
    | "rejected"
    | "draft";
  submitted_at: string; // ISO
  phone?: string;
};

export type AdminApplicationsResponse = {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  items: AdminApplicationItem[];
};

export type AdminApplicationsQuery = {
  page: number; // 1-based
  page_size: number; // set 15
  q?: string;
  status?: string;
  level?: string;
  school?: string;
  date_from?: string; // ISO 8601
  date_to?: string; // ISO 8601
  sort_by?: string; // "submitted_at"
  sort_dir?: "asc" | "desc";
};

type State = {
  data: AdminApplicationsResponse | null;
  query: AdminApplicationsQuery;
  loading: boolean;
  error: string | null;
  exporting: boolean;
};

const initialState: State = {
  data: null,
  query: {
    page: 1,
    page_size: 15,
    sort_by: "submitted_at",
    sort_dir: "desc",
  },
  loading: false,
  error: null,
  exporting: false,
};

function toQueryString(q: AdminApplicationsQuery) {
  const p = new URLSearchParams();
  Object.entries(q).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    p.set(k, String(v));
  });
  return p.toString();
}

export const fetchAdminApplications = createAsyncThunk(
  "adminApplications/fetch",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;
    const role = String(state.auth.role ?? "")
      .toLowerCase()
      .trim();

    if (role !== "admin") return rejectWithValue("Forbidden: admin only");
    if (!token) return rejectWithValue("Missing token");

    try {
      const qs = toQueryString(state.adminApplications.query);
      return await apiFetch(`/admin/applications?${qs}`, {}, token);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// Export CSV as blob (don’t use apiFetch because it always parses JSON)
export const exportApprovedCsv = createAsyncThunk(
  "adminApplications/exportApprovedCsv",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;
    const role = String(state.auth.role ?? "")
      .toLowerCase()
      .trim();

    if (role !== "admin") return rejectWithValue("Forbidden: admin only");
    if (!token) return rejectWithValue("Missing token");

    const { q, level, school, date_from, date_to, sort_dir } =
      state.adminApplications.query;

    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (level) params.set("level", level);
    if (school) params.set("school", school);
    if (date_from) params.set("date_from", date_from);
    if (date_to) params.set("date_to", date_to);
    if (sort_dir) params.set("sort_dir", sort_dir);

    const url = `https://api.kandarabursary.com/api/v1/admin/applications/export-approved.csv?${params.toString()}`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        // backend likely returns JSON error; try parse, fallback to text
        let msg = "Failed to export CSV";
        try {
          const j = await res.json();
          msg = j?.detail ?? msg;
        } catch {
          const t = await res.text();
          if (t) msg = t;
        }
        throw new Error(msg);
      }

      const blob = await res.blob();

      // Convert blob to a serializable data URL (base64 string)
      const dataUrl: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      });

      return dataUrl;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

const slice = createSlice({
  name: "adminApplications",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<Partial<AdminApplicationsQuery>>) {
      state.query = { ...state.query, ...action.payload };
    },
    resetQuery(state) {
      state.query = initialState.query;
    },
    clearAdminApplications(state) {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.exporting = false;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchAdminApplications.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchAdminApplications.fulfilled, (s, a) => {
      s.loading = false;
      s.data = a.payload as AdminApplicationsResponse;
    });
    b.addCase(fetchAdminApplications.rejected, (s, a: any) => {
      s.loading = false;
      s.error = a.payload ?? "Failed to load applications";
    });

    b.addCase(exportApprovedCsv.pending, (s) => {
      s.exporting = true;
      s.error = null;
    });
    b.addCase(exportApprovedCsv.fulfilled, (s) => {
      s.exporting = false;
    });
    b.addCase(exportApprovedCsv.rejected, (s, a: any) => {
      s.exporting = false;
      s.error = a.payload ?? "Failed to export CSV";
    });
  },
});

export const { setQuery, resetQuery, clearAdminApplications } = slice.actions;
export default slice.reducer;
