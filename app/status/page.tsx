"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  Clock,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  LogOut,
} from "lucide-react";

import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchMyApplication,
  clearApplication,
} from "@/redux/features/applicationSlice";
import { logout } from "@/redux/features/authSlice";

type Status = "draft" | "submitted" | "pending" | "approved" | "rejected";

export default function StatusPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const {
    trackingNumber,
    status,
    timeline,
    documents,
    loading,
    error,

    // student
    fullName,
    phone,
    educationLevel,
    institution,
    nationalId,
    registrationNumber,
    studentClassForm,

    // guardian
    parentName,
    parentId,
    parentPhone,
    relationship,
    guardianPhoto,
    guardianYearOfBirth,
  } = useSelector((state: RootState) => state.application);

  const token = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    if (!token) return;
    dispatch(fetchMyApplication());
  }, [dispatch, token]);

  const normalizedStatus = useMemo(() => {
    const s = (status || "draft").toLowerCase() as Status;
    return s;
  }, [status]);

  const canEdit = ["draft", "submitted"].includes(normalizedStatus);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearApplication());
    localStorage.removeItem("token");
    router.push("/");
  };

  const docs = documents ?? [];

  const [previewMap, setPreviewMap] = useState<Record<string, string>>({});

  // ✅ Clear old image previews whenever documents change
  useEffect(() => {
    setPreviewMap({});
  }, [docs]);

  function docVersion(doc: any) {
    return doc?.created_at || doc?.filename || doc?.size_bytes || "";
  }

  function previewKey(doc: any) {
    return `${doc?.doc_type}:${docVersion(doc)}`;
  }

  useEffect(() => {
    if (!token) return;
    if (!docs.length) return;

    let alive = true;
    const createdUrls: string[] = [];

    const loadImagePreviews = async () => {
      const imageDocs = docs.filter((d: any) =>
        d?.content_type?.startsWith("image/"),
      );

      const results = await Promise.all(
        imageDocs.map(async (doc: any) => {
          const key = previewKey(doc);

          // already loaded
          if (previewMap[key]) return null;

          try {
            const version = doc?.created_at || doc?.filename || Date.now();
            const url = `${doc.url}?v=${encodeURIComponent(version)}`;

            const res = await fetch(url, {
              cache: "no-store",
              headers: {
                Authorization: `Bearer ${token}`,
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
              },
            });

            if (!res.ok) return null;

            const blob = await res.blob();
            const objectUrl = URL.createObjectURL(blob);
            createdUrls.push(objectUrl);

            return { key, objectUrl };
          } catch {
            return null;
          }
        }),
      );

      if (!alive) {
        // if the component unmounted, revoke anything we created
        createdUrls.forEach((u) => URL.revokeObjectURL(u));
        return;
      }

      const next: Record<string, string> = {};
      for (const r of results) {
        if (r) next[r.key] = r.objectUrl;
      }

      if (Object.keys(next).length) {
        setPreviewMap((prev) => ({ ...prev, ...next }));
      }
    };

    loadImagePreviews();

    return () => {
      alive = false;
      // revoke urls created during this run
      createdUrls.forEach((u) => URL.revokeObjectURL(u));
    };
    // IMPORTANT: we intentionally don't include previewMap to avoid refetch loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, docs]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">
              Application Status
            </h1>
            <p className="text-gray-500 text-sm">
              Track your bursary application progress
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm text-black hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
            Loading application details...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-white rounded-xl shadow p-6 text-center text-red-600">
            {String(error)}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow p-6 space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-semibold text-black">
                    Application Status
                  </h2>
                  <p className="text-sm text-gray-500">
                    Tracking Number:{" "}
                    <span className="font-medium text-black">
                      {trackingNumber || "N/A"}
                    </span>
                  </p>
                </div>

                <StatusPill status={normalizedStatus} />
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                {timeline && timeline.length > 0 ? (
                  timeline.map((item: any, index: number) => (
                    <TimelineItem
                      key={index}
                      active={index === 0}
                      title={prettyStatus(item.status)}
                      subtitle={item.message}
                    />
                  ))
                ) : (
                  <TimelineItem
                    active
                    title="Draft Created"
                    subtitle="Your draft application has been created"
                  />
                )}
              </div>

              {/* Info box */}
              <div className="flex bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                <Clock size={19} className="mr-2 shrink-0" />
                Your application is currently under review. This process
                typically takes 2–4 weeks. You will receive a phone call once a
                decision has been made.
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Student */}
              <InfoCard
                title="Student Details"
                subtitle="Information provided by the applicant"
                action={
                  canEdit ? (
                    <button
                      onClick={() => router.push("/application/edit/student")}
                      className="text-sm text-blue-700 underline hover:cursor-pointer"
                    >
                      Edit
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">Locked</span>
                  )
                }
                items={[
                  { label: "Full Name", value: fullName || "-" },
                  { label: "Phone Number", value: phone || "-" },
                  {
                    label: "Education Level",
                    value: prettyEducationLevel(educationLevel),
                  },
                  { label: "Institution", value: institution || "-" },
                  // { label: "National ID", value: nationalId || "-" },
                  {
                    label: "Registration Number",
                    value: registrationNumber || "-",
                  },
                  { label: "Class / Grade", value: studentClassForm || "-" },
                ]}
              />

              {/* Guardian */}
              <InfoCard
                title="Parent/Guardian Details"
                subtitle="Parent/guardian information on your application"
                action={
                  canEdit ? (
                    <button
                      onClick={() => router.push("/application/edit/guardian")}
                      className="text-sm text-blue-700 underline hover:cursor-pointer"
                    >
                      Edit
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">Locked</span>
                  )
                }
                items={[
                  { label: "Full Name", value: parentName || "-" },
                  { label: "National ID", value: parentId || "-" },
                  { label: "Phone Number", value: parentPhone || "-" },
                  {
                    label: "Year of Birth",
                    value: guardianYearOfBirth
                      ? guardianYearOfBirth.toString()
                      : "-",
                  },
                  {
                    label: "Relationship",
                    value: prettyRelationship(relationship),
                  },
                ]}
                extra={
                  guardianPhoto ? (
                    <div className="pt-2">
                      <div className="text-xs font-semibold text-gray-500 mb-2">
                        Guardian Photo
                      </div>
                      <div className="flex items-center gap-3">
                        <img
                          src={guardianPhoto}
                          alt="Guardian"
                          className="h-16 w-16 rounded-full object-cover border border-gray-200"
                        />
                        <a
                          href={guardianPhoto}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-700 underline"
                        >
                          View photo
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 text-sm text-gray-500">
                      {/* No guardian photo uploaded. */}
                    </div>
                  )
                }
              />
            </div>

            {/* Documents */}
            <div className="bg-white rounded-xl shadow p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-black">Uploaded Documents</h3>
                <p className="text-gray-500 text-sm">
                  Review the documents you submitted
                </p>
              </div>

              {docs.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No documents uploaded.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {docs.map((doc: any, idx: number) => {
                    const label = prettyDocType(
                      doc.doc_type || `document_${idx + 1}`,
                    );
                    const isImage = doc.content_type?.startsWith("image/");
                    const key = previewKey(doc);

                    if (isImage) {
                      const previewSrc = previewMap[key];

                      return (
                        <div
                          key={key}
                          className="rounded-xl border border-gray-200 bg-white overflow-hidden"
                        >
                          <div className="p-3 border-b border-gray-100">
                            <div className="text-sm font-semibold text-black truncate">
                              {label}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {doc.filename || "Image"}
                            </div>
                          </div>

                          {previewSrc ? (
                            <img
                              src={previewSrc}
                              alt={label}
                              className="w-full h-56 object-cover bg-gray-50"
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-56 flex items-center justify-center text-sm text-gray-500 bg-gray-50">
                              Loading image...
                            </div>
                          )}
                        </div>
                      );
                    }

                    // non-image: keep as link (optional)
                    return (
                      <a
                        key={key}
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white shrink-0">
                            <FileText className="h-5 w-5 text-gray-600" />
                          </span>

                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-black truncate">
                              {label}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {doc.filename || "File"}
                            </div>
                          </div>
                        </div>

                        <ExternalLink className="h-4 w-4 text-gray-400 shrink-0 mt-1" />
                      </a>
                    );
                  })}
                </div>
              )}

              {docs.length > 0 && token ? (
                <p className="text-xs text-gray-400">
                  Above are the images and documents you uploaded.
                </p>
              ) : null}
            </div>

            {/* Help */}
            <div className="bg-white rounded-xl shadow p-6 text-sm space-y-2">
              <h3 className="font-semibold text-black">Need Help?</h3>

              <p className="text-gray-500">
                Phone: <span className="text-black">+254 700 000 000</span>
              </p>
              <p className="text-gray-500">
                Email:{" "}
                <span className="text-black">bursary@constituency.go.ke</span>
              </p>
              <p className="text-gray-500">
                Office Hours:{" "}
                <span className="text-black">
                  Monday – Friday, 8:00 AM – 5:00 PM
                </span>
              </p>
            </div>

            {/* Back */}
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 text-sm font-medium text-black hover:underline"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Small UI helpers ---------- */

function StatusPill({ status }: { status: Status }) {
  const cls =
    status === "approved"
      ? "bg-green-600"
      : status === "rejected"
        ? "bg-red-600"
        : status === "submitted" || status === "pending"
          ? "bg-yellow-600"
          : "bg-gray-600";

  return (
    <span className={`${cls} text-white px-4 py-1 rounded text-sm`}>
      {status.toUpperCase()}
    </span>
  );
}

function TimelineItem({
  title,
  subtitle,
  active = false,
}: {
  title: string;
  subtitle: string;
  active?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div
        className={`mt-1 h-3 w-3 rounded-full ${active ? "bg-blue-600" : "bg-gray-300"}`}
      />
      <div>
        <p
          className={`font-medium ${active ? "text-blue-700" : "text-gray-700"}`}
        >
          {title}
        </p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  subtitle,
  items,
  extra,
  action,
}: {
  title: string;
  subtitle: string;
  items: { label: string; value: string }[];
  extra?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-black">{title}</h3>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      <div className="grid gap-4 text-sm">
        {items.map((it) => (
          <div key={it.label}>
            <p className="text-gray-500">{it.label}</p>
            <p className="font-medium text-black wrap-break-word">{it.value}</p>
          </div>
        ))}
      </div>

      {extra ? <div>{extra}</div> : null}
    </div>
  );
}

function prettyDocType(docType: string) {
  return docType.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function prettyStatus(status: string) {
  if (!status) return "-";
  return status.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function prettyRelationship(r: string | null) {
  if (!r) return "-";
  return r.replace(/\b\w/g, (c) => c.toUpperCase());
}

function prettyEducationLevel(level: string | null) {
  if (!level) return "-";
  if (level.toLowerCase() === "secondary") return "Secondary";
  if (level.toLowerCase() === "university") return "University/College";
  return level;
}
