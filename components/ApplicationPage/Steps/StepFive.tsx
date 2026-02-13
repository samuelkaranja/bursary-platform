"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { submitApplication } from "@/redux/features/applicationSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  prevStep: () => void;
}

export default function StepFive({ prevStep }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [agree, setAgree] = useState(false);
  const application = useSelector((state: RootState) => state.application);

  const handleSubmit = async () => {
    const result = await dispatch(submitApplication());

    if (submitApplication.fulfilled.match(result)) {
      toast.success("Application submitted successfully!");
      router.push("/success");
    } else {
      toast.error("Submission failed. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900">
        Review Your Application
      </h2>
      <p className="text-gray-500 mt-1 mb-8">
        Please review all information before submitting
      </p>

      <div className="space-y-6 text-sm">
        <div>
          <h3 className="font-semibold text-blue-900">Account Information</h3>
          <p>Phone: {application.phone || "-"}</p>
        </div>

        <div>
          <h3 className="font-semibold text-blue-900">Student Details</h3>
          <p>Full Name: {application.fullName || "-"}</p>
          <p>Institution: {application.institution || "-"}</p>
          <p>ID Number: {application.nationalId || "-"}</p>
          <p>Registration Number: {application.registrationNumber || "-"}</p>
        </div>

        <div>
          <h3 className="font-semibold text-blue-900">
            Parent/Guardian Details
          </h3>
          <p>Name: {application.parentName || "-"}</p>
          <p>ID Number: {application.parentId || "-"}</p>
          <p>Phone: {application.parentPhone || "-"}</p>
          <p>Relationship: {application.relationship || "-"}</p>
        </div>
      </div>

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

      <div className="flex justify-between items-center mt-10">
        <button
          onClick={prevStep}
          className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          ← Previous
        </button>

        <button
          disabled={!agree}
          onClick={handleSubmit}
          className={`px-6 py-2 rounded-lg text-white transition
          ${agree ? "bg-blue-900 hover:bg-blue-800" : "bg-gray-300 cursor-not-allowed"}`}
        >
          Submit Application ✓
        </button>
      </div>
    </div>
  );
}
