"use client";

import { useState } from "react";

interface Props {
  prevStep: () => void;
  formData: any;
  onSubmit: () => void;
}

export default function StepFive({ prevStep, formData, onSubmit }: Props) {
  const [agree, setAgree] = useState(false);

  return (
    <div>
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-900">
        Review Your Application
      </h2>
      <p className="text-gray-500 mt-1 mb-8">
        Please review all information before submitting
      </p>

      {/* Review Sections */}
      <div className="space-y-6 text-sm">
        <div>
          <h3 className="font-semibold text-blue-900">Account Information</h3>
          <p>Phone: {formData.phone}</p>
        </div>

        <div>
          <h3 className="font-semibold text-blue-900">Student Details</h3>
          <p>Full Name: {formData.fullName}</p>
          <p>Institution: {formData.institution}</p>
          <p>ID Number: {formData.nationalId}</p>
          <p>Registration Number: {formData.registrationNumber}</p>
        </div>

        <div>
          <h3 className="font-semibold text-blue-900">
            Parent/Guardian Details
          </h3>
          <p>Name: {formData.parentName}</p>
          <p>ID Number: {formData.parentId}</p>
          <p>Phone: {formData.parentPhone}</p>
          <p>Relationship: {formData.relationship}</p>
        </div>
      </div>

      {/* Declaration */}
      <div className="bg-gray-100 rounded-xl p-4 mt-8 flex gap-3">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-1"
        />
        <p className="text-sm text-gray-700">
          I hereby declare that all information provided is true and accurate. I
          understand that providing false information may result in
          disqualification.
        </p>
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
          disabled={!agree}
          onClick={onSubmit}
          className={`px-6 py-2 rounded-lg text-white transition
          ${
            agree
              ? "bg-blue-900 hover:bg-blue-800"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Submit Application ✓
        </button>
      </div>
    </div>
  );
}
