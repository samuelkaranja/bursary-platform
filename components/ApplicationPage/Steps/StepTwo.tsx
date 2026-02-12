"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: any) => void;
}

export default function StepTwo({ nextStep, prevStep, updateFormData }: Props) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleNext = () => {
    if (!phone || !password || password !== confirmPassword) return;

    updateFormData({ phone, password });
    nextStep();
  };

  return (
    <div>
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-900">
        Create Your Account
      </h2>
      <p className="text-gray-500 mt-1 mb-8">
        Set up your login credentials to track your application
      </p>

      {/* Form */}
      <div className="space-y-6">
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="text"
            placeholder="0700 000 000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          <p className="text-sm text-gray-500 mt-2">
            This will be your username
          </p>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
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
          disabled={!phone || !password || password !== confirmPassword}
          className={`px-6 py-2 rounded-lg text-white transition flex items-center gap-2
            ${
              phone && password && password === confirmPassword
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
