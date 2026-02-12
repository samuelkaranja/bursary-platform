"use client";

import { useState } from "react";

interface Props {
  nextStep: () => void;
  updateFormData: (data: any) => void;
}

export default function StepOne({ nextStep, updateFormData }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleNext = () => {
    if (!selected) return;

    updateFormData({ educationLevel: selected });
    nextStep();
  };

  const handleCancel = () => {
    // Redirect to landing page
    window.location.href = "/";
  };

  return (
    <div>
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-900">
        Select Your Education Level
      </h2>
      <p className="text-gray-500 mt-1 mb-6">
        Choose the education level that applies to you
      </p>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Secondary School */}
        <div
          onClick={() => setSelected("secondary")}
          className={`cursor-pointer rounded-xl border p-6 transition-all
            ${
              selected === "secondary"
                ? "border-blue-900 bg-blue-50 shadow-sm"
                : "border-gray-200 hover:border-blue-400"
            }`}
        >
          <div className="flex flex-col items-start space-y-3">
            <div className="text-blue-900 text-3xl">🏫</div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Secondary School
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                For students in Form 1-4
              </p>
            </div>
          </div>
        </div>

        {/* University */}
        <div
          onClick={() => setSelected("university")}
          className={`cursor-pointer rounded-xl border p-6 transition-all
            ${
              selected === "university"
                ? "border-blue-900 bg-blue-50 shadow-sm"
                : "border-gray-200 hover:border-blue-400"
            }`}
        >
          <div className="flex flex-col items-start space-y-3">
            <div className="text-blue-900 text-3xl">🎓</div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                University/College
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                For students in tertiary institutions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center mt-10">
        <button
          onClick={handleCancel}
          className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
        >
          ← Cancel
        </button>

        <button
          onClick={handleNext}
          disabled={!selected}
          className={`px-6 py-2 rounded-lg text-white transition flex items-center gap-2
            ${
              selected
                ? "bg-blue-900 hover:bg-blue-800"
                : "bg-gray-300 cursor-not-allowed"
            }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
