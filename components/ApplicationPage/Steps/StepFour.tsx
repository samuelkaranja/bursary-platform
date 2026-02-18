"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { AppDispatch, RootState } from "@/redux/store";
import { submitGuardianDetails } from "@/redux/features/applicationSlice";
import toast from "react-hot-toast";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}

interface FormValues {
  parentName: string;
  parentId: string;
  parentPhone: string;
  yearOfBirth: string;
  relationship: string;
  idFront: FileList | null;
  idBack: FileList | null;
  guardianPhoto: FileList | null;
}

export default function StepFour({ nextStep, prevStep }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    loading,
    parentName,
    parentId,
    parentPhone,
    relationship,
    guardianPhoto: reduxGuardianPhoto,
  } = useSelector((state: RootState) => state.application);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      parentName: "",
      parentId: "",
      parentPhone: "",
      yearOfBirth: "",
      relationship: "",
      idFront: null,
      idBack: null,
      guardianPhoto: null,
    },
  });

  const idFrontFiles = watch("idFront");
  const idBackFiles = watch("idBack");
  const guardianPhotoFiles = watch("guardianPhoto");

  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    reduxGuardianPhoto || null,
  );

  // Hydrate form from Redux when going back
  useEffect(() => {
    setValue("parentName", parentName || "");
    setValue("parentId", parentId || "");
    setValue("parentPhone", parentPhone || "");
    setValue("relationship", relationship || "");
    if (reduxGuardianPhoto) setPhotoPreview(reduxGuardianPhoto);
  }, [
    parentName,
    parentId,
    parentPhone,
    relationship,
    reduxGuardianPhoto,
    setValue,
  ]);

  // Generate previews when files change
  useEffect(() => {
    if (idFrontFiles?.[0])
      setFrontPreview(URL.createObjectURL(idFrontFiles[0]));
    if (idBackFiles?.[0]) setBackPreview(URL.createObjectURL(idBackFiles[0]));
    if (guardianPhotoFiles?.[0]) {
      photoPreview && URL.revokeObjectURL(photoPreview);
      setPhotoPreview(URL.createObjectURL(guardianPhotoFiles[0]));
    }

    return () => {
      idFrontFiles?.[0] && URL.revokeObjectURL(frontPreview || "");
      idBackFiles?.[0] && URL.revokeObjectURL(backPreview || "");
      guardianPhotoFiles?.[0] && URL.revokeObjectURL(photoPreview || "");
    };
  }, [idFrontFiles, idBackFiles, guardianPhotoFiles]);

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("guardian_full_name", data.parentName);
    formData.append("guardian_id_number", data.parentId);
    formData.append("guardian_phone", data.parentPhone);
    formData.append("guardian_year_of_birth", data.yearOfBirth);
    formData.append("guardian_relationship", data.relationship);
    if (data.idFront?.[0])
      formData.append("guardian_id_front", data.idFront[0]);
    if (data.idBack?.[0]) formData.append("guardian_id_back", data.idBack[0]);
    if (data.guardianPhoto?.[0])
      formData.append("guardian_photo", data.guardianPhoto[0]);

    const result = await dispatch(submitGuardianDetails(formData));

    if (submitGuardianDetails.fulfilled.match(result)) {
      toast.success("Guardian details saved successfully!");
      const uploadedPhotoUrl = result.payload.guardian_photo;
      if (uploadedPhotoUrl) setPhotoPreview(uploadedPhotoUrl);
      nextStep();
    } else {
      toast.error("Failed to save guardian details. Please try again.");
    }
  };

  const renderFileLabel = (fileList: FileList | null) =>
    fileList?.[0] ? (
      <span className="text-gray-900 text-sm">{fileList[0].name}</span>
    ) : (
      <span className="text-gray-500 text-sm text-center">
        Click to upload or drag and drop <br /> PDF, JPG, PNG (Max 5MB)
      </span>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-xl font-semibold text-gray-900">
        Parent/Guardian Details
      </h2>
      <p className="text-gray-500 mt-1 mb-8">
        Provide information about your parent or guardian
      </p>

      <div className="space-y-6">
        {/* Guardian Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Parent/Guardian Photo
          </label>
          <Controller
            name="guardianPhoto"
            control={control}
            rules={{ required: "Guardian photo is required" }}
            render={({ field }) => (
              <div
                className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 cursor-pointer hover:border-blue-900 transition"
                onClick={() =>
                  document.getElementById("guardianPhotoInput")?.click()
                }
              >
                {renderFileLabel(field.value)}
              </div>
            )}
          />
          <input
            type="file"
            id="guardianPhotoInput"
            className="hidden"
            {...register("guardianPhoto", {
              required: "Guardian photo is required",
            })}
            accept=".jpg,.jpeg,.png"
          />
          {errors.guardianPhoto && (
            <p className="text-red-500 text-sm mt-1">
              {errors.guardianPhoto.message}
            </p>
          )}
          {photoPreview && (
            <div className="mt-3">
              <img
                src={photoPreview}
                alt="Guardian Preview"
                className="w-32 h-32 object-cover rounded-full border"
              />
            </div>
          )}
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            {...register("parentName", { required: "Full Name is required" })}
            placeholder="Enter parent/guardian full name"
            className="w-full rounded-lg text-black border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          {errors.parentName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.parentName.message}
            </p>
          )}
        </div>

        {/* ID Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID Number
          </label>
          <input
            {...register("parentId", { required: "ID Number is required" })}
            placeholder="Enter ID number"
            className="w-full rounded-lg text-black border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          {errors.parentId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.parentId.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            {...register("parentPhone", {
              required: "Phone number is required",
            })}
            placeholder="0700 000 000"
            className="w-full rounded-lg text-black border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          {errors.parentPhone && (
            <p className="text-red-500 text-sm mt-1">
              {errors.parentPhone.message}
            </p>
          )}
        </div>

        {/* Year of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year of Birth
          </label>
          <input
            {...register("yearOfBirth", {
              required: "Year of birth is required",
              pattern: {
                value: /^\d{4}$/,
                message: "Enter a valid 4-digit year",
              },
            })}
            placeholder="YYYY"
            className="w-full rounded-lg text-black border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          {errors.yearOfBirth && (
            <p className="text-red-500 text-sm mt-1">
              {errors.yearOfBirth.message}
            </p>
          )}
        </div>

        {/* Relationship */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relationship
          </label>
          <select
            {...register("relationship", {
              required: "Relationship is required",
            })}
            className="w-full rounded-lg text-black border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
          >
            <option value="">Select relationship</option>
            <option value="father">Father</option>
            <option value="mother">Mother</option>
            <option value="guardian">Guardian</option>
          </select>
          {errors.relationship && (
            <p className="text-red-500 text-sm mt-1">
              {errors.relationship.message}
            </p>
          )}
        </div>

        {/* ID Uploads */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Front ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ID Front
            </label>
            <input
              type="file"
              id="idFrontInput"
              className="hidden"
              {...register("idFront", { required: "Front ID is required" })}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <div
              className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 cursor-pointer hover:border-blue-900 transition"
              onClick={() => document.getElementById("idFrontInput")?.click()}
            >
              {renderFileLabel(idFrontFiles)}
            </div>
            {errors.idFront && (
              <p className="text-red-500 text-sm mt-1">
                {errors.idFront.message}
              </p>
            )}
            {frontPreview && (
              <p className="mt-2 text-blue-700 text-sm underline">
                <a
                  href={frontPreview}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
            <input
              type="file"
              id="idBackInput"
              className="hidden"
              {...register("idBack", { required: "Back ID is required" })}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <div
              className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 cursor-pointer hover:border-blue-900 transition"
              onClick={() => document.getElementById("idBackInput")?.click()}
            >
              {renderFileLabel(idBackFiles)}
            </div>
            {errors.idBack && (
              <p className="text-red-500 text-sm mt-1">
                {errors.idBack.message}
              </p>
            )}
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
          type="button"
          onClick={prevStep}
          className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          ← Previous
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg transition flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? "Saving details..." : "Next →"}
        </button>
      </div>
    </form>
  );
}
