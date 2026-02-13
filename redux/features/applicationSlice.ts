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
  loading: boolean;

  // Student Details
  phone: string | null;
  fullName: string | null;
  institution: string | null;
  nationalId: string | null;
  registrationNumber: string | null;

  // Guardian Details
  parentName: string | null;
  parentId: string | null;
  parentPhone: string | null;
  relationship: string | null;
}

const initialState: ApplicationState = {
  applicationId: null,
  educationLevel: null,
  status: null,
  trackingNumber: null,
  timeline: [],
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
      .addCase(createDraft.fulfilled, (state, action) => {
        state.applicationId = action.payload.id;
        state.educationLevel = action.payload.education_level;
        state.status = action.payload.status;
      })
      .addCase(submitStudentDetails.fulfilled, (state, action) => {
        // Update student fields in Redux
        state.phone = action.payload.phone || state.phone;
        state.fullName = action.payload.fullName || state.fullName;
        state.institution = action.payload.institution || state.institution;
        state.nationalId = action.payload.nationalId || state.nationalId;
        state.registrationNumber =
          action.payload.registrationNumber || state.registrationNumber;
      })
      .addCase(submitGuardianDetails.fulfilled, (state, action) => {
        // Update guardian fields in Redux
        state.parentName = action.payload.parentName || state.parentName;
        state.parentId = action.payload.parentId || state.parentId;
        state.parentPhone = action.payload.parentPhone || state.parentPhone;
        state.relationship = action.payload.relationship || state.relationship;
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        state.trackingNumber = action.payload.tracking_number;
        state.status = "submitted";
      });
  },
});

export const { clearApplication } = applicationSlice.actions;
export default applicationSlice.reducer;
