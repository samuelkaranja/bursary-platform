"use client";

import { useState } from "react";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: any) => void;
}

export default function StepThreeSecondary({
  nextStep,
  prevStep,
  updateFormData,
}: Props) {
  const [form, setForm] = useState({
    fullName: "",
    schoolName: "",
    admissionNumber: "",
    classForm: "",
    birthCertificate: null as File | null,
  });

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e: any) =>
    setForm({ ...form, birthCertificate: e.target.files[0] });

  const handleNext = () => {
    updateFormData(form);
    nextStep();
  };

  return (
    <div>
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-900">Student Details</h2>
      <p className="text-gray-500 mt-1 mb-8">
        Provide your secondary school information
      </p>

      {/* Form */}
      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            name="fullName"
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

          <label className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 cursor-pointer hover:border-blue-900 transition">
            <span className="text-gray-500 text-sm text-center">
              Click to upload or drag and drop
              <br />
              PDF, JPG, PNG (Max 5MB)
            </span>
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
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
          className="px-6 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg transition flex items-center gap-2"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
