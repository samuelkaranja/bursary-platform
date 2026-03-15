import React from "react";
import { Download } from "lucide-react";

export function ApplicationsHeader({
  total,
  exporting,
  onExportApproved,
  onExportSubmitted,
}: {
  total: number;
  exporting?: "submitted" | "approved" | null;
  onExportApproved?: () => void;
  onExportSubmitted?: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="text-base font-semibold text-slate-900">
          All Applications
        </div>
        <div className="text-sm text-slate-500">
          {total} of {total} applications
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={exporting === "submitted"}
          onClick={onExportSubmitted}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4" />
          {exporting === "submitted" ? "Exporting..." : "Export Submitted"}
        </button>

        <button
          type="button"
          disabled={exporting === "approved"}
          onClick={onExportApproved}
          className="inline-flex items-center gap-2 rounded-xl bg-[#173B8F] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4" />
          {exporting === "approved" ? "Exporting..." : "Export Approved"}
        </button>
      </div>
    </div>
  );
}
