"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { submitGuardianDetails } from "@/redux/features/applicationSlice";
import toast from "react-hot-toast";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}

export default function StepFour({ nextStep, prevStep }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.application);

  const [form, setForm] = useState({
    parentName: "",
    parentId: "",
    parentPhone: "",
    yearOfBirth: "",
    relationship: "",
    idFront: null as File | null,
    idBack: null as File | null,
  });

  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "idFront" | "idBack",
  ) => {
    if (e.target.files?.[0]) {
      setForm({ ...form, [field]: e.target.files[0] });
      field === "idFront"
        ? setFrontPreview(URL.createObjectURL(e.target.files[0]))
        : setBackPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleNext = async () => {
    const formData = new FormData();
    formData.append("guardian_full_name", form.parentName);
    formData.append("guardian_id_number", form.parentId);
    formData.append("guardian_phone", form.parentPhone);
    formData.append("guardian_year_of_birth", form.yearOfBirth);
    formData.append("guardian_relationship", form.relationship);

    if (form.idFront) formData.append("guardian_id_front", form.idFront);
    if (form.idBack) formData.append("guardian_id_back", form.idBack);

    const result = await dispatch(submitGuardianDetails(formData));

    if (submitGuardianDetails.fulfilled.match(result)) {
      toast.success("Guardian details saved successfully!");
      nextStep();
    } else {
      toast.error("Failed to save guardian details. Please try again.");
    }
  };

  // Revoke object URLs on unmount or when previews change
  useEffect(() => {
    return () => {
      frontPreview && URL.revokeObjectURL(frontPreview);
      backPreview && URL.revokeObjectURL(backPreview);
    };
  }, [frontPreview, backPreview]);

  const renderFileLabel = (file: File | null) =>
    file ? (
      <span className="text-gray-900 text-sm">{file.name}</span>
    ) : (
      <span className="text-gray-500 text-sm text-center">
        Click to upload or drag and drop
        <br />
        PDF, JPG, PNG (Max 5MB)
      </span>
    );

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900">
        Parent/Guardian Details
      </h2>
      <p className="text-gray-500 mt-1 mb-8">
        Provide information about your parent or guardian
      </p>

      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            name="parentName"
            value={form.parentName}
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
            value={form.parentId}
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
            value={form.parentPhone}
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
            value={form.yearOfBirth}
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
            value={form.relationship}
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
          {/* Front ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ID Front
            </label>
            <div
              className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 cursor-pointer hover:border-blue-900 transition"
              onClick={() => document.getElementById("idFrontInput")?.click()}
            >
              {renderFileLabel(form.idFront)}
            </div>
            <input
              type="file"
              id="idFrontInput"
              className="hidden"
              onChange={(e) => handleFileChange(e, "idFront")}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {frontPreview && (
              <p className="mt-2 text-blue-700 text-sm underline">
                <a href={frontPreview} target="_blank" rel="noopener noreferrer">
                  View Front ID
                </a>
              </p>
            )}
          </div>

          {/* Back ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ID Back
            </label>
            <div
              className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 cursor-pointer hover:border-blue-900 transition"
              onClick={() => document.getElementById("idBackInput")?.click()}
            >
              {renderFileLabel(form.idBack)}
            </div>
            <input
              type="file"
              id="idBackInput"
              className="hidden"
              onChange={(e) => handleFileChange(e, "idBack")}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {backPreview && (
              <p className="mt-2 text-blue-700 text-sm underline">
                <a href={backPreview} target="_blank" rel="noopener noreferrer">
                  View Back ID
                </a>
              </p>
            )}
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
          disabled={loading}
          className="px-6 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg transition flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? "Saving details..." : "Next →"}
        </button>
      </div>
    </div>
  );
}
