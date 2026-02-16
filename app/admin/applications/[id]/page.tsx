import { AdminShell } from "@/components/adminPage/AdminShell";
import { ApplicationReviewClient } from "@/components/adminPage/applications/review/ApplicationReviewClient";
import React from "react";

export default async function ApplicationReviewPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AdminShell
      title="Application Review"
      subtitle="Review and make a decision on this application"
    >
      <ApplicationReviewClient id={id} />
    </AdminShell>
  );
}
