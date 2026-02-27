import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "../api";
import { RootState } from "../store";

// -------------------
// Types
// -------------------

export type ApplicationDocument = {
  doc_type: string;
  filename: string;
  content_type: string;
  url: string;
  previewUrl?: string; // frontend-only (blob URL)
  size_bytes?: number;
  created_at?: string;
};

type TimelineItem = {
  status: string;
  message: string;
  created_at: string;
};

interface ApplicationState {
  applicationId: number | null;
  educationLevel: string | null;
  status: string | null;
  trackingNumber: string | null;

  timeline: TimelineItem[];
  documents: ApplicationDocument[];

  loading: boolean;
  error: string | null;

  // student
  phone: string | null;
  fullName: string | null;
  institution: string | null;
  nationalId: string | null;
  registrationNumber: string | null;
  studentClassForm: string | null;

  // guardian
  parentName: string | null;
  parentId: string | null;
  parentPhone: string | null;
  relationship: string | null;
  guardianPhoto: string | null;
  guardianYearOfBirth: number | null;
}

const initialState: ApplicationState = {
  applicationId: null,
  educationLevel: null,
  status: null,
  trackingNumber: null,

  timeline: [],
  documents: [],

  error: null,
  loading: false,

  phone: null,
  fullName: null,
  institution: null,
  nationalId: null,
  registrationNumber: null,
  studentClassForm: null,

  parentName: null,
  parentId: null,
  parentPhone: null,
  relationship: null,
  guardianPhoto: null,
  guardianYearOfBirth: null,
};

// -------------------
// Async Thunks
// -------------------

export const createDraft = createAsyncThunk(
  "application/createDraft",
  async (education_level: string, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;

    const data = await apiFetch(
      "/applications/draft",
      {
        method: "POST",
        body: JSON.stringify({ education_level }),
      },
      token!,
    );

    return data;
  },
);

export const submitStudentDetails = createAsyncThunk(
  "application/studentDetails",
  async (formData: FormData, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { accessToken } = state.auth;
    const { applicationId } = state.application;

    // ✅ Guard: token must exist
    if (!accessToken) {
      return rejectWithValue("You are not logged in. Please login again.");
    }

    // ✅ Guard: applicationId must exist
    if (!applicationId) {
      return rejectWithValue(
        "Missing application id. Please reload the page and try again.",
      );
    }

    try {
      const data = await apiFetch(
        `/applications/${applicationId}/student-details`,
        {
          method: "PATCH",
          body: formData,
        },
        accessToken,
      );

      return data;
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to save student details");
    }
  },
);

export const submitGuardianDetails = createAsyncThunk(
  "application/guardianDetails",
  async (formData: FormData, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { accessToken } = state.auth;
    const { applicationId } = state.application;

    // ✅ Guard: token must exist
    if (!accessToken) {
      return rejectWithValue("You are not logged in. Please login again.");
    }

    // ✅ Guard: applicationId must exist (prevents /applications/null/...)
    if (!applicationId) {
      return rejectWithValue(
        "Missing application id. Please reload the page and try again.",
      );
    }

    try {
      const data = await apiFetch(
        `/applications/${applicationId}/guardian-details`,
        {
          method: "PATCH",
          body: formData,
        },
        accessToken,
      );

      return data;
    } catch (err: any) {
      // Ensure we return a friendly message into action.payload
      return rejectWithValue(err?.message || "Failed to save guardian details");
    }
  },
);

export const submitApplication = createAsyncThunk(
  "application/submit",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { accessToken } = state.auth;
    const { applicationId } = state.application;

    // ✅ Guard: must be authenticated
    if (!accessToken) {
      return rejectWithValue("You are not logged in. Please login again.");
    }

    // ✅ Guard: application must be loaded
    if (!applicationId) {
      return rejectWithValue(
        "Application not loaded. Please reload the page and try again.",
      );
    }

    const formData = new FormData();
    formData.append("declaration_accepted", "true");

    try {
      const data = await apiFetch(
        `/applications/${applicationId}/submit`,
        {
          method: "POST",
          body: formData,
        },
        accessToken,
      );

      return data;
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to submit application.");
    }
  },
);

export const fetchMyApplication = createAsyncThunk(
  "application/fetchMyApplication",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;

    try {
      // /applications/me returns: { application, timeline, documents }
      const data = await apiFetch("/applications/me", {}, token!);
      console.log(data);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// -------------------
// Slice
// -------------------
const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    clearApplication(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE DRAFT
      .addCase(createDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.applicationId = action.payload.id;
        state.educationLevel = action.payload.education_level;
        state.status = action.payload.status;
      })
      .addCase(createDraft.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error?.message ?? "Failed to create draft";
      })

      // STUDENT DETAILS
      .addCase(submitStudentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitStudentDetails.fulfilled, (state, action) => {
        state.loading = false;

        state.phone = action.payload.phone ?? state.phone;
        state.fullName = action.payload.student_full_name ?? state.fullName;
        state.institution =
          action.payload.institution_name ?? state.institution;
        state.nationalId = action.payload.student_id_number ?? state.nationalId;
        state.registrationNumber =
          action.payload.student_registration_number ??
          state.registrationNumber;

        state.studentClassForm =
          action.payload.student_class_form ?? state.studentClassForm;
      })
      .addCase(submitStudentDetails.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload ??
          action.error?.message ??
          "Failed to save student details";
      })

      // GUARDIAN DETAILS
      .addCase(submitGuardianDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitGuardianDetails.fulfilled, (state, action) => {
        state.loading = false;

        state.parentName =
          action.payload.guardian_full_name ?? state.parentName;
        state.parentId = action.payload.guardian_id_number ?? state.parentId;
        state.parentPhone = action.payload.guardian_phone ?? state.parentPhone;
        state.relationship =
          action.payload.guardian_relationship ?? state.relationship;

        state.guardianPhoto =
          action.payload.guardian_photo ?? state.guardianPhoto;
      })
      .addCase(submitGuardianDetails.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload ??
          action.error?.message ??
          "Failed to save guardian details";
      })

      // SUBMIT APPLICATION
      .addCase(submitApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.trackingNumber = action.payload.tracking_number;
        state.status = "submitted";
      })
      .addCase(submitApplication.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload ??
          action.error?.message ??
          "Failed to submit application";
      })

      // FETCH MY APPLICATION (IMPORTANT FIX)
      .addCase(fetchMyApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyApplication.fulfilled, (state, action) => {
        state.loading = false;

        const p = action.payload; // { application, timeline, documents }
        const a = p?.application;

        state.applicationId = a?.id ?? null;
        state.educationLevel = a?.education_level ?? null;
        state.status = a?.status ?? null;
        state.trackingNumber = a?.tracking_number ?? null;

        state.phone = a?.phone ?? null;
        state.fullName = a?.student_full_name ?? null;
        state.institution = a?.institution_name ?? null;
        state.registrationNumber = a?.student_registration_number ?? null;
        state.nationalId = a?.student_id_number ?? null;
        state.studentClassForm = a?.student_class_form ?? null;

        state.parentName = a?.guardian_full_name ?? null;
        state.parentId = a?.guardian_id_number ?? null;
        state.parentPhone = a?.guardian_phone ?? null;
        state.relationship = a?.guardian_relationship ?? null;
        state.guardianYearOfBirth = a?.guardian_year_of_birth ?? null;

        // Not in your /me response currently
        state.guardianPhoto = null;

        state.timeline = p?.timeline ?? [];

        // Keep docs exactly as backend returns
        state.documents = p?.documents ?? [];
      })
      .addCase(fetchMyApplication.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch application";
      });
  },
});

export const { clearApplication } = applicationSlice.actions;
export default applicationSlice.reducer;
