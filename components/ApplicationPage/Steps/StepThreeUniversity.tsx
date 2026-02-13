"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { submitStudentDetails } from "@/redux/features/applicationSlice";
import toast from "react-hot-toast";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}

export default function StepThreeUniversity({ nextStep, prevStep }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.application);

  const [form, setForm] = useState({
    fullName: "",
    institution: "",
    nationalId: "",
    registrationNumber: "",
    admissionLetter: null as File | null,
  });

  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setForm({ ...form, admissionLetter: e.target.files[0] });
      setPreviewURL(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleNext = async () => {
    const formData = new FormData();
    formData.append("student_full_name", form.fullName);
    formData.append("institution_name", form.institution);
    formData.append("student_registration_number", form.registrationNumber);
    formData.append("student_id_number", form.nationalId);

    if (form.admissionLetter)
      formData.append("admission_letter", form.admissionLetter);

    const result = await dispatch(submitStudentDetails(formData));
    if (submitStudentDetails.fulfilled.match(result)) {
      toast.success("Student details saved successfully!");
      nextStep();
    } else {
      toast.error("Failed to save student details. Please try again.");
    }
  };

  useEffect(() => {
    return () => {
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900">Student Details</h2>
      <p className="text-gray-500 mt-1 mb-8">
        Provide your university/college information
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Institution Name
          </label>
          <input
            name="institution"
            value={form.institution}
            onChange={handleChange}
            placeholder="Enter your institution name"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            National ID Number
          </label>
          <input
            name="nationalId"
            value={form.nationalId}
            onChange={handleChange}
            placeholder="Enter your ID number"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student Registration Number
          </label>
          <input
            name="registrationNumber"
            value={form.registrationNumber}
            onChange={handleChange}
            placeholder="Enter registration number"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        {/* Admission Letter Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Admission Letter
          </label>
          <label className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 cursor-pointer hover:border-blue-900 transition relative">
            {!form.admissionLetter ? (
              <span className="text-gray-500 text-sm text-center">
                Click to upload or drag and drop
                <br />
                PDF, JPG, PNG (Max 5MB)
              </span>
            ) : (
              <span className="text-gray-900 text-sm text-center">
                {form.admissionLetter.name}
              </span>
            )}
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
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

      <div className="flex justify-between items-center mt-10">
        <button
          onClick={prevStep}
          className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          ← Previous
        </button>

        <button
          onClick={handleNext}
          disabled={loading}
          className="px-6 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg transition flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? "Saving details..." : "Next →"}
        </button>
      </div>
    </div>
  );
}
