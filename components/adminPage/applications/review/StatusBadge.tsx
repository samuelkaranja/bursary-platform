import React from "react";
import type { Status } from "./types";

export function StatusBadge({ status }: { status: Status }) {
  const cls =
    status === "pending"
      ? "bg-amber-100 text-amber-700"
      : status === "approved"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-rose-100 text-rose-700";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${cls}`}
    >
      {status}
    </span>
  );
}
