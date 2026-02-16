import React from "react";
import type { Status } from "./types";

const STATUS_CLASSES: Record<Status, string> = {
  draft: "bg-gray-100 text-gray-700",
  submitted: "bg-blue-100 text-blue-700",
  under_review: "bg-amber-100 text-amber-700",
  decision_pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};

const STATUS_LABELS: Record<Status, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  decision_pending: "Decision Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export function StatusPill({ status }: { status: Status }) {
  const cls = STATUS_CLASSES[status];
  const label = STATUS_LABELS[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${cls}`}
    >
      {label}
    </span>
  );
}
