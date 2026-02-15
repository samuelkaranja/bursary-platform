import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "../api";
import { RootState } from "../store";

// -------------------
// Types
// -------------------
interface ApplicationState {
  applicationId: number | null;
  educationLevel: string | null;
  status: string | null;
  trackingNumber: string | null;
  timeline: any[];
  documents: any[];
  loading: boolean;
  error: string | null;

  phone: string | null;
  fullName: string | null;
  institution: string | null;
  nationalId: string | null;
  registrationNumber: string | null;

  parentName: string | null;
  parentId: string | null;
  parentPhone: string | null;
  relationship: string | null;
  guardianPhoto: string | null;
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

  parentName: null,
  parentId: null,
  parentPhone: null,
  relationship: null,
  guardianPhoto: null,
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
  async (formData: FormData, { getState }) => {
    const state = getState() as RootState;
    const { accessToken } = state.auth;
    const { applicationId } = state.application;

    const data = await apiFetch(
      `/applications/${applicationId}/student-details`,
      {
        method: "PATCH",
        body: formData,
      },
      accessToken!,
    );

    return data; // Expect backend returns fields like fullName, phone, etc.
  },
);

export const submitGuardianDetails = createAsyncThunk(
  "application/guardianDetails",
  async (formData: FormData, { getState }) => {
    const state = getState() as RootState;
    const { accessToken } = state.auth;
    const { applicationId } = state.application;

    const data = await apiFetch(
      `/applications/${applicationId}/guardian-details`,
      {
        method: "PATCH",
        body: formData,
      },
      accessToken!,
    );

    return data; // Expect backend returns fields like parentName, parentPhone, etc.
  },
);

export const submitApplication = createAsyncThunk(
  "application/submit",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { accessToken } = state.auth;
    const { applicationId } = state.application;

    const formData = new FormData();
    formData.append("declaration_accepted", "true");

    return await apiFetch(
      `/applications/${applicationId}/submit`,
      {
        method: "POST",
        body: formData,
      },
      accessToken!,
    );
  },
);

export const fetchMyApplication = createAsyncThunk(
  "application/fetchMyApplication",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;

    try {
      const data = await apiFetch("/applications/me", {}, token!);
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
      state.applicationId = null;
      state.educationLevel = null;
      state.status = null;
      state.trackingNumber = null;

      state.phone = null;
      state.fullName = null;
      state.institution = null;
      state.nationalId = null;
      state.registrationNumber = null;

      state.parentName = null;
      state.parentId = null;
      state.parentPhone = null;
      state.relationship = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE DRAFT
      .addCase(createDraft.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.applicationId = action.payload.id;
        state.educationLevel = action.payload.education_level;
        state.status = action.payload.status;
      })
      .addCase(createDraft.rejected, (state) => {
        state.loading = false;
      })

      // STUDENT DETAILS
      .addCase(submitStudentDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitStudentDetails.fulfilled, (state, action) => {
        state.loading = false;

        state.phone = action.payload.phone || state.phone;
        state.fullName = action.payload.student_full_name || state.fullName;
        state.institution =
          action.payload.institution_name || state.institution;
        state.nationalId = action.payload.student_id_number || state.nationalId;
        state.registrationNumber =
          action.payload.student_registration_number ||
          state.registrationNumber;
      })
      .addCase(submitStudentDetails.rejected, (state) => {
        state.loading = false;
      })

      // GUARDIAN DETAILS
      .addCase(submitGuardianDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitGuardianDetails.fulfilled, (state, action) => {
        state.loading = false;

        state.parentName =
          action.payload.guardian_full_name || state.parentName;
        state.parentId = action.payload.guardian_id_number || state.parentId;
        state.parentPhone = action.payload.guardian_phone || state.parentPhone;
        state.relationship =
          action.payload.guardian_relationship || state.relationship;
        state.guardianPhoto =
          action.payload.guardian_photo || state.guardianPhoto;
      })
      .addCase(submitGuardianDetails.rejected, (state) => {
        state.loading = false;
      })

      // SUBMIT APPLICATION
      .addCase(submitApplication.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.trackingNumber = action.payload.tracking_number;
        state.status = "submitted";
      })
      .addCase(submitApplication.rejected, (state) => {
        state.loading = false;
      })

      // FETCHING APPLICATION DETAILS
      .addCase(fetchMyApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyApplication.fulfilled, (state, action) => {
        state.loading = false;

        const { application, timeline, documents } = action.payload;

        state.applicationId = application.id;
        state.educationLevel = application.education_level;
        state.status = application.status;
        state.trackingNumber = application.tracking_number;

        state.phone = application.phone;
        state.fullName = application.student_full_name;
        state.institution = application.institution_name;
        state.registrationNumber = application.student_registration_number;
        state.nationalId = application.student_id_number;

        state.parentName = application.guardian_full_name;
        state.parentId = application.guardian_id_number;
        state.parentPhone = application.guardian_phone;
        state.relationship = application.guardian_relationship;

        state.timeline = timeline;
        state.documents = documents;
      })
      .addCase(fetchMyApplication.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearApplication } = applicationSlice.actions;
export default applicationSlice.reducer;
