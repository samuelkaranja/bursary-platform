"use client";

import React from "react";
import type { ApplicationReviewData, Status } from "./types";
import { BackToApplications } from "./BackToApplications";
import { StatusBadge } from "./StatusBadge";
import { DetailsSection } from "./DetailsSection";
import { DocumentsSection } from "./DocumentsSection";
import { DecisionSection } from "./DecisionSection";

export function ApplicationReviewClient({
  data,
}: {
  data: ApplicationReviewData;
}) {
  async function approve() {
    // TODO: call your API route
    // await fetch(`/api/admin/applications/${data.id}/approve`, { method: "POST" })
    console.log("approve", data.id);
  }

  async function reject() {
    // TODO: call your API route
    // await fetch(`/api/admin/applications/${data.id}/reject`, { method: "POST" })
    console.log("reject", data.id);
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
        <StatusBadge status={data.status as Status} />
      </div>

      <DetailsSection data={data} />
      <DocumentsSection documents={data.documents} />
      <DecisionSection onApprove={approve} onReject={reject} />
    </>
  );
}
