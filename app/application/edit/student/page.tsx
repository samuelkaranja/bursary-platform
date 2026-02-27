"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { AppDispatch, RootState } from "@/redux/store";
import { fetchMyApplication } from "@/redux/features/applicationSlice";
import StepThreeSecondary from "@/components/ApplicationPage/Steps/StepThreeSecondary";

export default function EditStudentPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const token = useSelector((s: RootState) => s.auth.accessToken);
  const { applicationId, status, loading, error } = useSelector(
    (s: RootState) => s.application,
  );

  const normalized = String(status || "draft").toLowerCase();
  const canEdit = ["draft", "submitted"].includes(normalized);

  useEffect(() => {
    if (!token) return; // hydration may still be happening

    if (!canEdit) {
      toast.error("This application cannot be edited at the moment.");
      router.push("/status");
      return;
    }

    // Ensure applicationId exists before rendering form (needed by PATCH)
    dispatch(fetchMyApplication());
  }, [dispatch, token, canEdit, router]);

  if (!token) {
    return (
      <div className="min-h-screen grid place-items-center text-gray-600">
        Loading session...
      </div>
    );
  }

  if (loading && !applicationId) {
    return (
      <div className="min-h-screen grid place-items-center text-gray-600">
        Loading application...
      </div>
    );
  }

  if (!loading && error) {
    return (
      <div className="min-h-screen grid place-items-center text-red-600">
        {String(error)}
      </div>
    );
  }

  if (!applicationId) {
    return (
      <div className="min-h-screen grid place-items-center text-gray-600">
        No application found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
        <StepThreeSecondary
          nextStep={() => router.push("/status")}
          prevStep={() => router.push("/status")}
        />
      </div>
    </div>
  );
}
