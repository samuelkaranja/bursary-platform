"use client";

import { useState } from "react";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: any) => void;
}

export default function StepFour({
  nextStep,
  prevStep,
  updateFormData,
}: Props) {
  const [form, setForm] = useState({
    parentName: "",
    parentId: "",
    parentPhone: "",
    yearOfBirth: "",
    relationship: "",
    idFront: null as File | null,
    idBack: null as File | null,
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: any, field: string) => {
    setForm({ ...form, [field]: e.target.files[0] });
  };

  const handleNext = () => {
    updateFormData(form);
    nextStep();
  };

  return (
    <div>
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-900">
        Parent/Guardian Details
      </h2>
      <p className="text-gray-500 mt-1 mb-8">
        Provide information about your parent or guardian
      </p>

      {/* Form */}
      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            name="parentName"
            onChange={handleChange}
            placeholder="Enter parent/guardian full name"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        {/* ID Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID Number
          </label>
          <input
            name="parentId"
            onChange={handleChange}
            placeholder="Enter ID number"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            name="parentPhone"
            onChange={handleChange}
            placeholder="0700 000 000"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        {/* Year of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year of Birth
          </label>
          <input
            name="yearOfBirth"
            onChange={handleChange}
            placeholder="YYYY"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        {/* Relationship */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relationship
          </label>
          <select
            name="relationship"
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          >
            <option value="">Select relationship</option>
            <option value="father">Father</option>
            <option value="mother">Mother</option>
            <option value="guardian">Guardian</option>
          </select>
        </div>

        {/* ID Uploads */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ID Front
            </label>

            <label className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 cursor-pointer hover:border-blue-900 transition">
              <span className="text-gray-500 text-sm text-center">
                Click to upload or drag and drop
                <br />
                PDF, JPG, PNG (Max 5MB)
              </span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleFileChange(e, "idFront")}
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ID Back
            </label>

            <label className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 cursor-pointer hover:border-blue-900 transition">
              <span className="text-gray-500 text-sm text-center">
                Click to upload or drag and drop
                <br />
                PDF, JPG, PNG (Max 5MB)
              </span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleFileChange(e, "idBack")}
              />
            </label>
          </div>
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
