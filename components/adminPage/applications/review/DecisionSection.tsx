"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export function DecisionSection({
  onApprove,
  onReject,
}: {
  onApprove?: () => Promise<void> | void;
  onReject?: () => Promise<void> | void;
}) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function handle(action: "approve" | "reject") {
    try {
      setLoading(action);
      if (action === "approve") await onApprove?.();
      else await onReject?.();
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <div className="text-sm font-semibold text-slate-900">
          Make a Decision
        </div>
        <div className="text-xs text-slate-500">
          Approve or reject this application
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={() => handle("approve")}
          disabled={loading !== null}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
        >
          <CheckCircle2 className="h-5 w-5" />
          {loading === "approve" ? "Approving..." : "Approve Application"}
        </button>

        <button
          type="button"
          onClick={() => handle("reject")}
          disabled={loading !== null}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
        >
          <XCircle className="h-5 w-5" />
          {loading === "reject" ? "Rejecting..." : "Reject Application"}
        </button>
      </div>
    </section>
  );
}
