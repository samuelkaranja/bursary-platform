"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchMyApplication,
  submitApplication,
} from "@/redux/features/applicationSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  prevStep: () => void;
}

export default function StepFive({ prevStep }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [agree, setAgree] = useState(false);

  const { loading, error, documents, ...application } = useSelector(
    (state: RootState) => state.application,
  );
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const [allDocuments, setAllDocuments] = useState<any[]>([]);
  console.log(allDocuments);
  console.log(application);
  // Fetch application on mount
  useEffect(() => {
    dispatch(fetchMyApplication())
      .unwrap()
      .catch(() => {
        toast.error("Failed to load application.");
        router.push("/");
      });
  }, [dispatch, router]);

  useEffect(() => {
    if (!documents || documents.length === 0) return;

    let objectUrls: string[] = [];

    const loadDocuments = async () => {
      try {
        const updatedDocs = await Promise.all(
          documents.map(async (doc: any) => {
            if (!doc.url) return doc;

            try {
              const response = await fetch(doc.url, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (!response.ok) {
                throw new Error("Failed to fetch document");
              }

              const blob = await response.blob();
              const objectUrl = URL.createObjectURL(blob);

              objectUrls.push(objectUrl);

              return {
                ...doc,
                previewUrl: objectUrl,
              };
            } catch (error) {
              console.error("Error loading document:", doc.doc_type);
              return doc;
            }
          }),
        );

        setAllDocuments(updatedDocs);
      } catch (error) {
        console.error("Error processing documents", error);
      }
    };

    loadDocuments();

    // Cleanup function to prevent memory leaks
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [documents, token]);

  const handleSubmit = async () => {
    const result = await dispatch(submitApplication());

    if (submitApplication.fulfilled.match(result)) {
      toast.success("Application submitted successfully!");
      router.push("/success");
    } else {
      toast.error("Submission failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600">
        Loading your application...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600">
        Error loading application: {error}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900">
        Review Your Application
      </h2>
      <p className="text-gray-500 mt-1 mb-6">
        Please review all information before submitting
      </p>

      <div className="space-y-6 text-sm">
        {/* Account */}
        <div>
          <h3 className="font-semibold text-blue-900">Account Information</h3>
          <p className="text-[14px] pb-1">
            <span className="text-black text-[15px] font-semibold">Phone:</span>{" "}
            {application.phone || "-"}
          </p>
        </div>

        {/* Student */}
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">Student Details</h3>
          <p className="text-[14px] pb-1">
            <span className="text-black text-[15px] font-semibold">
              Full Name:
            </span>{" "}
            {application.fullName || "-"}
          </p>
          <p className="text-[14px] pb-1">
            <span className="text-black text-[15px] font-semibold">
              Education Level:
            </span>{" "}
            {application.educationLevel || "-"}
          </p>
          <p className="text-[14px] pb-1">
            <span className="text-black text-[15px] font-semibold">
              Institution:
            </span>{" "}
            {application.institution || "-"}
          </p>
          <p className="text-[14px] pb-1">
            <span className="text-black text-[15px] font-semibold">
              ID Number:
            </span>{" "}
            {application.nationalId || "-"}
          </p>
          <p className="text-[14px] pb-1">
            <span className="text-black text-[15px] font-semibold">
              Registration Number:
            </span>{" "}
            {application.registrationNumber || "-"}
          </p>
        </div>

        {/* Guardian */}
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">
            Parent/Guardian Details
          </h3>
          <p className="text-[14px] pb-1">
            <span className="text-black text-[15px] font-semibold">Name:</span>{" "}
            {application.parentName || "-"}
          </p>
          <p className="text-[14px] pb-1">
            <span className="text-black text-[15px] font-semibold">
              ID Number:
            </span>{" "}
            {application.parentId || "-"}
          </p>
          <p className="text-[14px] pb-1">
            <span className="text-black text-[15px] font-semibold">Phone:</span>{" "}
            {application.parentPhone || "-"}
          </p>
          <p className="text-[14px] pb-1">
            <span className="text-black text-[15px] font-semibold">
              Relationship:
            </span>{" "}
            {application.relationship || "-"}
          </p>
        </div>

        {/* Uploaded Documents */}
        <div>
          <h3 className="font-semibold text-blue-900">Uploaded Documents</h3>

          {allDocuments.length === 0 ? (
            <p>No documents uploaded</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 mt-3">
              {allDocuments.map((doc: any, index: number) => {
                const previewUrl = doc.previewUrl || null;
                const isImage = doc.content_type?.startsWith("image/");

                return (
                  <div
                    key={index}
                    className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                  >
                    <p className="text-sm font-medium mb-2 capitalize">
                      {doc.doc_type.replaceAll("_", " ")}
                    </p>

                    {previewUrl ? (
                      isImage ? (
                        <img
                          src={previewUrl}
                          alt={doc.doc_type}
                          className="w-full h-48 object-cover rounded-md"
                        />
                      ) : (
                        <a
                          href={previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 underline text-sm"
                        >
                          View {doc.filename || doc.doc_type}
                        </a>
                      )
                    ) : (
                      <p className="text-sm text-gray-500">Not uploaded</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
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
          onClick={handleSubmit}
          className={`px-6 py-2 rounded-lg text-white transition ${
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
