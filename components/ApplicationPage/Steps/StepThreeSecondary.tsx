"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchMyApplication,
  submitStudentDetails,
} from "@/redux/features/applicationSlice";
import toast from "react-hot-toast";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}

interface FormValues {
  fullName: string;
  schoolName: string;
  admissionNumber: string;
  classForm: string;
  birthCertificate: FileList;
}

export default function StepThreeSecondary({ nextStep, prevStep }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const {
    loading,
    fullName,
    institution,
    registrationNumber,
    studentClassForm,
    documents,
  } = useSelector((state: RootState) => state.application);

  const token = useSelector((state: RootState) => state.auth.accessToken);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const [existingBirthCertPreview, setExistingBirthCertPreview] = useState<
    string | null
  >(null);

  const watchedFile = watch("birthCertificate");

  // Prefill form from Redux state
  useEffect(() => {
    reset({
      fullName: fullName || "",
      schoolName: institution || "",
      admissionNumber: registrationNumber || "",
      classForm: studentClassForm || "",
    });
  }, [fullName, institution, registrationNumber, studentClassForm, reset]);

  useEffect(() => {
    if (!token) return;

    const birthDoc = (documents ?? []).find(
      (d) => d.doc_type === "birth_certificate",
    );
    if (!birthDoc?.url) {
      setExistingBirthCertPreview(null);
      return;
    }

    let alive = true;
    let objectUrl: string | null = null;

    (async () => {
      try {
        const res = await fetch(birthDoc.url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;

        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);

        if (alive) setExistingBirthCertPreview(objectUrl);
      } catch {
        // ignore
      }
    })();

    return () => {
      alive = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [token, documents]);

  // File preview effect
  useEffect(() => {
    if (watchedFile && watchedFile.length > 0) {
      const file = watchedFile[0];
      const url = URL.createObjectURL(file);
      setPreviewURL(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewURL(null);
    }
  }, [watchedFile]);

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("student_full_name", data.fullName);
    formData.append("institution_name", data.schoolName);
    formData.append("student_registration_number", data.admissionNumber);
    formData.append("student_class_form", data.classForm);

    if (data.birthCertificate?.[0]) {
      formData.append("birth_certificate", data.birthCertificate[0]);
    }

    const result = await dispatch(submitStudentDetails(formData));

    if (submitStudentDetails.fulfilled.match(result)) {
      toast.success("Student details saved successfully!");
      // ✅ refresh application so documents update
      await dispatch(fetchMyApplication());
      nextStep();
    } else {
      const msg =
        typeof result.payload === "string"
          ? result.payload
          : result.error?.message || "Failed to save student details.";
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Student Details</h2>
        <p className="text-gray-500 mt-1 mb-8">
          Provide your secondary school information
        </p>

        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              {...register("fullName", {
                required: "Full name is required",
              })}
              placeholder="Enter your full name"
              className="w-full rounded-lg text-black border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* School Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School Name
            </label>
            <input
              {...register("schoolName", {
                required: "School name is required",
              })}
              placeholder="Enter your school name"
              className="w-full rounded-lg text-black border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            {errors.schoolName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.schoolName.message}
              </p>
            )}
          </div>

          {/* Admission Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admission Number
            </label>
            <input
              {...register("admissionNumber", {
                required: "Admission number is required",
              })}
              placeholder="Enter admission number"
              className="w-full rounded-lg text-black border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            {errors.admissionNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.admissionNumber.message}
              </p>
            )}
          </div>

          {/* Grade / Form */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grade
            </label>
            <select
              {...register("classForm", {
                required: "Please select a grade",
              })}
              className="w-full rounded-lg text-black border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
            >
              <option value="">Select Grade</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Form 3">Form 3</option>
              <option value="Form 4">Form 4</option>
            </select>
            {errors.classForm && (
              <p className="text-red-500 text-sm mt-1">
                {errors.classForm.message}
              </p>
            )}
          </div>

          {/* Birth Certificate Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Birth Certificate
            </label>

            {!watchedFile?.length && existingBirthCertPreview && (
              <p className="mb-3 text-sm text-green-700">
                Birth certificate already uploaded —{" "}
                <a
                  href={existingBirthCertPreview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  View current file
                </a>
              </p>
            )}

            <label className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 cursor-pointer hover:border-blue-900 transition relative">
              {!watchedFile?.length ? (
                <span className="text-gray-500 text-sm text-center">
                  Click to upload or drag and drop
                  <br />
                  PDF, JPG, PNG (Max 5MB)
                </span>
              ) : (
                <span className="text-gray-900 text-sm text-center">
                  {watchedFile[0].name}
                </span>
              )}

              <input
                type="file"
                {...register("birthCertificate")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </label>

            {previewURL && (
              <p className="mt-2 text-blue-700 text-sm underline">
                <a href={previewURL} target="_blank" rel="noopener noreferrer">
                  View Uploaded File
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-10">
          <button
            type="button"
            onClick={prevStep}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            ← Previous
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? "Saving details..." : "Next →"}
          </button>
        </div>
      </div>
    </form>
  );
}
