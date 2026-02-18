"use client";

import React, { useEffect, useState } from "react";
import type { ApplicationReviewData, Status } from "./types";
import { BackToApplications } from "./BackToApplications";
import { StatusBadge } from "./StatusBadge";
import { DetailsSection } from "./DetailsSection";
import { DocumentsSection } from "./DocumentsSection";
import { DecisionSection } from "./DecisionSection";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { apiFetch } from "@/redux/api";
import { toast } from "react-hot-toast";

export function ApplicationReviewClient({ id }: { id: string }) {
  const token = useSelector((s: RootState) => s.auth.accessToken);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApplicationReviewData | null>(null);

  async function fetchDetails() {
    if (!token) {
      setError("No auth token");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await apiFetch(`/admin/applications/${id}`, {}, token);

      const app = res.application || {};

      const mapped: ApplicationReviewData = {
        id: String(app.id ?? id),
        status: (app.status as Status) ?? ("pending" as Status),
        student: {
          fullName: app.student_full_name ?? app.student_full_name ?? "",
          phoneNumber: app.phone ?? app.phone ?? "",
          educationLevel: app.education_level ?? "",
          institutionName: app.institution_name ?? "",
          idNumber: app.id_number ?? "",
          registrationNumber: app.registration_number ?? "",
          submissionDate: app.submitted_at
            ? new Date(app.submitted_at).toLocaleString()
            : "",
        },
        guardian: {
          fullName: app.guardian_full_name ?? "",
          idNumber: app.guardian_id_number ?? "",
          phoneNumber: app.guardian_phone ?? "",
          yearOfBirth: app.guardian_year_of_birth ?? "",
          relationship: app.guardian_relationship ?? "",
        },
        documents: (res.documents || []).map((d: any, idx: number) => ({
          id: d.doc_type ?? String(idx),
          label: d.filename ?? d.doc_type ?? `doc-${idx}`,
          href: d.url ?? d.href ?? "#",
        })),
      };

      setData(mapped);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  async function approve() {
    if (!token) return setError("No auth token");

    try {
      const res = await apiFetch(
        `/admin/applications/${id}/approve`,
        { method: "POST" },
        token,
      );

      const message = res?.message ?? "Application approved";
      toast.success(message);
      await fetchDetails();
    } catch (err: any) {
      const msg = err?.message || String(err);
      setError(msg);
      toast.error(msg);
    }
  }

  async function reject() {
    if (!token) return setError("No auth token");

    try {
      // API expects form-urlencoded; use fetch directly
      const response = await fetch(
        `https://api.kandarabursary.com/api/v1/admin/applications/${id}/reject`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ reason: "Rejected by admin" }).toString(),
        },
      );

      let payload: any = null;
      try {
        payload = await response.json();
      } catch {}

      if (!response.ok) {
        const msg =
          payload?.message ||
          payload?.detail ||
          `Request failed (${response.status})`;
        setError(msg);
        toast.error(msg);
      } else {
        const message = payload?.message ?? "Application rejected";
        toast.success(message);
        await fetchDetails();
      }
    } catch (err: any) {
      const msg = err?.message || String(err);
      setError(msg);
      toast.error(msg);
    }
  }

  return (
    <>
      <BackToApplications />

      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">
            Application Review
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Review and make a decision on this application
          </p>
        </div>
        <StatusBadge status={(data?.status ?? "pending") as Status} />
      </div>

      {loading && (
        <div className="text-sm text-slate-500">Loading application...</div>
      )}
      {error && <div className="text-sm text-rose-600">{error}</div>}

      {data ? (
        <>
          <DetailsSection data={data} />
          <DocumentsSection documents={data.documents} />
          <DecisionSection onApprove={approve} onReject={reject} />
        </>
      ) : null}
    </>
  );
}
