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

export default function StepThreeSecondary({ nextStep, prevStep }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.application);

  const [form, setForm] = useState({
    fullName: "",
    schoolName: "",
    admissionNumber: "",
    classForm: "",
    birthCertificate: null as File | null,
  });

  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setForm({ ...form, birthCertificate: e.target.files[0] });
      setPreviewURL(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleNext = async () => {
    const formData = new FormData();
    formData.append("student_full_name", form.fullName);
    formData.append("institution_name", form.schoolName);
    formData.append("student_registration_number", form.admissionNumber);
    formData.append("student_class_form", form.classForm);

    if (form.birthCertificate) {
      formData.append("birth_certificate", form.birthCertificate);
    }

    const result = await dispatch(submitStudentDetails(formData));

    if (submitStudentDetails.fulfilled.match(result)) {
      toast.success("Student details saved successfully!");
      nextStep();
    } else {
      toast.error("Failed to save student details. Please try again.");
    }
  };

  // Cleanup object URL
  useEffect(() => {
    return () => {
      previewURL && URL.revokeObjectURL(previewURL);
    };
  }, [previewURL]);

  return (
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
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        {/* School Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            School Name
          </label>
          <input
            name="schoolName"
            value={form.schoolName}
            onChange={handleChange}
            placeholder="Enter your school name"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        {/* Admission Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Admission Number
          </label>
          <input
            name="admissionNumber"
            value={form.admissionNumber}
            onChange={handleChange}
            placeholder="Enter admission number"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        {/* Class/Form */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Class / Form
          </label>
          <select
            name="classForm"
            value={form.classForm}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          >
            <option value="">Select Class/Form</option>
            <option>Form 1</option>
            <option>Form 2</option>
            <option>Form 3</option>
            <option>Form 4</option>
          </select>
        </div>

        {/* Birth Certificate Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Birth Certificate
          </label>

          <label className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 cursor-pointer hover:border-blue-900 transition relative">
            {!form.birthCertificate ? (
              <span className="text-gray-500 text-sm text-center">
                Click to upload or drag and drop
                <br />
                PDF, JPG, PNG (Max 5MB)
              </span>
            ) : (
              <span className="text-gray-900 text-sm text-center">
                {form.birthCertificate.name}
              </span>
            )}
            <input
              type="file"
              onChange={handleFileChange}
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
