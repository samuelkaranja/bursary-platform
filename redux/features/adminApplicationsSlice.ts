import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { apiFetch } from "../api";

export type AdminApplicationItem = {
  id: string; // backend stores ID as string
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
  page: number;
  page_size: number;
  q?: string;
  status?: string;
  level?: string;
  school?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
};

type State = {
  data: AdminApplicationsResponse | null;
  query: AdminApplicationsQuery;
  loading: boolean;
  error: string | null;
  exporting: boolean;
  deleting: boolean;
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
  deleting: false,
};

function toQueryString(q: AdminApplicationsQuery) {
  const p = new URLSearchParams();
  Object.entries(q).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    p.set(k, String(v));
  });
  return p.toString();
}

/* =========================
   FETCH APPLICATIONS
========================= */
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

/* =========================
   DELETE APPLICATION
========================= */
export const deleteAdminApplication = createAsyncThunk(
  "adminApplications/delete",
  async (id: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;
    const role = String(state.auth.role ?? "")
      .toLowerCase()
      .trim();

    if (role !== "admin") return rejectWithValue("Forbidden: admin only");
    if (!token) return rejectWithValue("Missing token");

    try {
      // ✅ Use apiFetch instead of fetch
      await apiFetch(`/admin/applications/${id}`, { method: "DELETE" }, token);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

/* =========================
   EXPORT CSV
========================= */
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

    const url = `/admin/applications/export-approved.csv?${params.toString()}`;

    try {
      const blob = await apiFetch(url, { method: "GET" }, token);
      return blob;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

/* =========================
   SLICE
========================= */
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
      state.deleting = false;
    },
  },
  extraReducers: (b) => {
    /* FETCH */
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

    /* DELETE */
    b.addCase(deleteAdminApplication.pending, (s) => {
      s.deleting = true;
    });
    b.addCase(deleteAdminApplication.fulfilled, (s, a) => {
      s.deleting = false;
      if (s.data) {
        s.data.items = s.data.items.filter(
          (item) => item.id !== a.payload.toString(),
        );
        if (s.data.items.length === 0 && s.query.page > 1) {
          s.query.page -= 1;
        }
      }
    });
    b.addCase(deleteAdminApplication.rejected, (s, a: any) => {
      s.deleting = false;
      s.error = a.payload ?? "Failed to delete application";
    });

    /* EXPORT */
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
