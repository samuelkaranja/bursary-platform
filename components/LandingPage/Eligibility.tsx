"use client";

import { useState } from "react";

export default function Eligibility() {
  const [activeTab, setActiveTab] = useState<"secondary" | "university">(
    "secondary",
  );

  return (
    <section className="py-15 bg-gray-100">
      <div className="max-w-5xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-900">
            Eligibility Requirements
          </h2>
          <p className="mt-2 text-gray-600 text-sm">
            Check the requirements based on your education level
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mt-8">
          <div className="bg-gray-200 rounded-full p-1 flex w-full max-w-md">
            <button
              onClick={() => setActiveTab("secondary")}
              className={`flex-1 py-2 text-sm rounded-full transition ${
                activeTab === "secondary"
                  ? "bg-white shadow text-blue-900 font-medium"
                  : "text-gray-600"
              }`}
            >
              Secondary School
            </button>

            <button
              onClick={() => setActiveTab("university")}
              className={`flex-1 py-2 text-sm rounded-full transition ${
                activeTab === "university"
                  ? "bg-white shadow text-blue-900 font-medium"
                  : "text-gray-600"
              }`}
            >
              University/College
            </button>
          </div>
        </div>

        {/* Content Card */}
        <div className="mt-10 bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          {activeTab === "secondary" ? (
            <>
              {/* Title */}
              <h3 className="font-semibold text-blue-900">
                Secondary School Requirements
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                For students currently enrolled in Form 1-4
              </p>

              {/* Required Documents */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-800">
                  Required Documents:
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  <li>✔ Birth certificate (certified copy)</li>
                  <li>✔ School admission letter or student ID</li>
                  <li>✔ Parent/Guardian national ID (front and back)</li>
                </ul>
              </div>

              {/* Qualifications */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-800">Qualifications:</h4>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  <li>✔ Must be a resident of the constituency</li>
                  <li>✔ Currently enrolled in a recognized secondary school</li>
                  <li>✔ Demonstrate financial need</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* Title */}
              <h3 className="font-semibold text-blue-900">
                University/College Requirements
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                For students in tertiary institutions
              </p>

              {/* Required Documents */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-800">
                  Required Documents:
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  <li>✔ National ID or passport (certified copy)</li>
                  <li>✔ Admission letter from institution</li>
                  <li>✔ Student registration number/ID</li>
                  <li>✔ Parent/Guardian national ID (front and back)</li>
                </ul>
              </div>

              {/* Qualifications */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-800">Qualifications:</h4>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  <li>✔ Must be a resident of the constituency</li>
                  <li>
                    ✔ Currently enrolled in a recognized tertiary institution
                  </li>
                  <li>✔ Demonstrate financial need and academic merit</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
