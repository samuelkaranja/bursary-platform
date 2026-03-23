"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { submitStudentDetails } from "@/redux/features/applicationSlice";
import toast from "react-hot-toast";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}

interface FormValues {
  fullName: string;
  institution: string;
  nationalId: string;
  registrationNumber: string;
  admissionLetter: FileList;
}

export default function StepThreeUniversity({ nextStep, prevStep }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, fullName, institution, nationalId, registrationNumber } =
    useSelector((state: RootState) => state.application);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      fullName: "",
      institution: "",
      nationalId: "",
      registrationNumber: "",
    },
  });

  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const admissionLetter = watch("admissionLetter");

  useEffect(() => {
    reset({
      fullName: fullName || "",
      institution: institution || "",
      nationalId: nationalId || "",
      registrationNumber: registrationNumber || "",
    });
  }, [fullName, institution, nationalId, registrationNumber, reset]);

  useEffect(() => {
    if (admissionLetter && admissionLetter.length > 0) {
      const file = admissionLetter[0];
      const url = URL.createObjectURL(file);
      setPreviewURL(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewURL(null);
    }
  }, [admissionLetter]);

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();

    formData.append("student_full_name", data.fullName);
    formData.append("institution_name", data.institution);
    formData.append("student_registration_number", data.registrationNumber);
    formData.append("student_id_number", data.nationalId);

    // Now guaranteed to exist
    formData.append("admission_letter", data.admissionLetter[0]);

    const result = await dispatch(submitStudentDetails(formData));

    if (submitStudentDetails.fulfilled.match(result)) {
      toast.success("Student details saved successfully!");
      nextStep();
    } else {
      toast.error("Failed to save student details. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-xl font-semibold text-gray-900">Student Details</h2>
      <p className="text-gray-500 mt-1 mb-8">
        Provide your university/college information
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

        {/* Institution */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Institution Name
          </label>
          <input
            {...register("institution", {
              required: "Institution name is required",
            })}
            placeholder="Enter your institution name"
            className="w-full rounded-lg text-black border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          {errors.institution && (
            <p className="text-red-500 text-sm mt-1">
              {errors.institution.message}
            </p>
          )}
        </div>

        {/* National ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            National ID Number
          </label>
          <input
            {...register("nationalId", {
              required: "National ID is required",
              pattern: {
                value: /^[0-9]+$/,
                message: "National ID must contain only numbers",
              },
              minLength: {
                value: 6,
                message: "Invalid ID number",
              },
            })}
            placeholder="Enter your ID number"
            className="w-full rounded-lg text-black border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          {errors.nationalId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.nationalId.message}
            </p>
          )}
        </div>

        {/* Registration Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student Registration Number
          </label>
          <input
            {...register("registrationNumber", {
              required: "Registration number is required",
            })}
            placeholder="Enter registration number"
            className="w-full rounded-lg text-black border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          {errors.registrationNumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.registrationNumber.message}
            </p>
          )}
        </div>

        {/* Admission Letter Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Admission Letter
          </label>

          <label className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 cursor-pointer hover:border-blue-900 transition relative">
            {!admissionLetter?.[0] ? (
              <span className="text-gray-500 text-sm text-center">
                Click to upload or drag and drop
                <br />
                PDF, JPG, PNG
              </span>
            ) : (
              <span className="text-gray-900 text-sm text-center">
                {admissionLetter[0].name}
              </span>
            )}

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              {...register("admissionLetter", {
                required: "Admission letter is required",
                validate: (files) => {
                  const file = files?.[0];
                  if (!file) return "Admission letter is required";

                  if (file.size > 20 * 1024 * 1024) {
                    return "File size must be less than 20MB";
                  }

                  return true;
                },
              })}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>

          {errors.admissionLetter && (
            <p className="text-red-500 text-sm mt-2">
              {errors.admissionLetter.message as string}
            </p>
          )}

          {previewURL && (
            <p className="mt-2 text-blue-700 text-sm underline">
              <a href={previewURL} target="_blank" rel="noopener noreferrer">
                View Uploaded File
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
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
    </form>
  );
}
