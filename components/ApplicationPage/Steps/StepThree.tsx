"use client";

import { useState } from "react";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: any) => void;
}

export default function StepThree({
  nextStep,
  prevStep,
  updateFormData,
}: Props) {
  const [form, setForm] = useState({
    fullName: "",
    institution: "",
    nationalId: "",
    registrationNumber: "",
    admissionLetter: null as File | null,
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: any) => {
    setForm({ ...form, admissionLetter: e.target.files[0] });
  };

  const handleNext = () => {
    updateFormData(form);
    nextStep();
  };

  return (
    <div>
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-900">Student Details</h2>
      <p className="text-gray-500 mt-1 mb-8">
        Provide your university/college information
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

        {/* Institution */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Institution Name
          </label>
          <input
            name="institution"
            onChange={handleChange}
            placeholder="Enter your institution name"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        {/* National ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            National ID Number
          </label>
          <input
            name="nationalId"
            onChange={handleChange}
            placeholder="Enter your ID number"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        {/* Registration Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student Registration Number
          </label>
          <input
            name="registrationNumber"
            onChange={handleChange}
            placeholder="Enter registration number"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Admission Letter
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
